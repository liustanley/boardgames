import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SocketService } from "../services/SocketService";
import { UsernameInput } from "../homepage/UsernameInput";
import { Player, LobbyPayload } from "../models/CodenamesTypes";
import "./CodenamesContainer.css";
import { CodenamesTeamSelection } from "./CodenamesTeamSelection";

interface CodenamesContainerProps extends RouteComponentProps {
  socket: SocketService;
}

interface CodenamesContainerState {
  username: string;
  playerList: Player[];
}

export class CodenamesContainer extends React.Component<
  CodenamesContainerProps,
  CodenamesContainerState
> {
  constructor(props: CodenamesContainerProps) {
    super(props);
    this.state = {
      username: "",
      playerList: [],
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
