import React, { Fragment } from "react";
import "./LoveLetterLobby.css";
import { LoveLetterColors } from "../models/constants";
import { SocketService } from "../services/SocketService";
import { ChatContainer } from "../chat/ChatContainer";

interface LoveLetterLobbyProps {
  usernameList: string[];
  socket: SocketService;
  username: string;
}

interface LoveLetterLobbyState {
  usernameList: string[];
  gameStarted: boolean;
  ready: boolean;
}

export class LoveLetterLobby extends React.Component<
  LoveLetterLobbyProps,
  LoveLetterLobbyState
> {
  constructor(props: LoveLetterLobbyProps) {
    super(props);
    this.state = {
      usernameList: props.usernameList,
      ready: false,
      gameStarted: false,
    };
  }

  onReady() {
    if (!this.state.ready) {
    }
    this.setState({ ready: !this.state.ready });
  }

  render() {
    return !this.state.gameStarted ? (
      <Fragment>
        <div className="loveLetterLobby">
          {this.state.usernameList.map((name) => (
            <Fragment>
              <hr color={LoveLetterColors.WHITE}></hr>
              <div className="lobbyName">{name}</div>
            </Fragment>
          ))}
          <hr color={LoveLetterColors.WHITE}></hr>
        </div>
        <div
          className={!this.state.ready ? "readyButton" : "readiedButton"}
          onClick={this.onReady.bind(this)}
        >
          <b>{!this.state.ready ? "OK" : "Waiting for others"}</b>
        </div>
        <ChatContainer
          socket={this.props.socket}
          username={this.props.username}
        />
      </Fragment>
    ) : (
      <div></div>
    );
  }
}
