import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { SocketService } from "../services/SocketService";
import { UsernameInput } from "../homepage/UsernameInput";
import { Player, Team } from "../models/CodenamesTypes";
import "./CodenamesContainer.css";
import { CodenamesTeamSelection } from "./CodenamesTeamSelection";

const socket: SocketService = new SocketService().init();

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
  RouteComponentProps,
  CodenamesContainerState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      // username: "",
      username: "Dillon",
      // playerList: [],
      playerList: [dillon, stanley, alex, christina, annette],
    };
  }

  // ON LOBBY

  onEnter(username: string) {
    this.setState({ username });
    // SOCKET registerPlayer
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
            socket={socket}
            username={this.state.username}
            playerList={this.state.playerList}
            roomCode={this.props.match.params}
          />
        )}
      </div>
    );
  }
}
