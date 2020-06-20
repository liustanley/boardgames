import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SocketService } from "../services/SocketService";
import { UsernameInput } from "../homepage/UsernameInput";
import { Player, Team, LobbyPayload } from "../models/CodenamesTypes";
import "./CodenamesContainer.css";
import { CodenamesTeamSelection } from "./CodenamesTeamSelection";

interface CodenamesContainerProps extends RouteComponentProps {
  socket: SocketService;
}

interface CodenamesContainerState {
  username: string;
  playerList: Player[];
}

// TODO
const dillon: Player = {
  username: "Dillon",
  team: Team.BLUE,
  spymaster: false,
};
const stanley: Player = {
  username: "Stanley",
  team: Team.RED,
  spymaster: false,
};
const alex: Player = { username: "Alex", team: Team.BLUE, spymaster: false };
const christina: Player = {
  username: "Christina",
  team: Team.RED,
  spymaster: true,
};
const annette: Player = {
  username: "Annette",
  team: Team.RED,
  spymaster: false,
};

export class CodenamesContainer extends React.Component<
  CodenamesContainerProps,
  CodenamesContainerState
> {
  constructor(props: CodenamesContainerProps) {
    super(props);
    this.state = {
      username: "",
      // username: "Dillon",
      playerList: [],
      // playerList: [dillon, stanley, alex, christina, annette],
    };
  }

  componentDidMount() {
    this.props.socket.CODENAMES.subscribeToLobby(this.onLobby.bind(this));
  }

  onLobby(payload: LobbyPayload) {
    this.setState({ playerList: payload.playerList });
  }

  onEnter(username: string) {
    this.setState({ username });
    this.props.socket.CODENAMES.registerPlayer({ username });
  }

  render() {
    return (
      <div className="codenamesContainer">
        {this.state.playerList.length === 0 ? (
          <div className="usernameInput">
            <UsernameInput onEnter={this.onEnter.bind(this)} />
          </div>
        ) : (
          <CodenamesTeamSelection
            socket={this.props.socket}
            username={this.state.username}
            playerList={this.state.playerList}
            roomCode={this.props.match.params}
          />
        )}
      </div>
    );
  }
}
