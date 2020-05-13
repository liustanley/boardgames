import React, { Fragment } from "react";
import "./LoveLetterLobby.css";
import { LoveLetterColors } from "../models/constants";
import { SocketService } from "../services/SocketService";
import { ChatContainer } from "../chat/ChatContainer";
import { gameStateEvent, PlayerStatus } from "../models/types";
import { LoveLetterGameState } from "./LoveLetterGameState";

interface LoveLetterLobbyProps {
  usernameList: string[];
  socket: SocketService;
  username: string;
}

interface LoveLetterLobbyState {
  usernameList: string[];
  gameStarted: boolean;
  ready: boolean;
  gameState: gameStateEvent | null;
}

// TODO:
const guard = { value: 1, key: "guard", description: "guess someone's card" };
const priest = { value: 2, key: "priest", description: "view someone's card" };

export class LoveLetterLobby extends React.Component<
  LoveLetterLobbyProps,
  LoveLetterLobbyState
> {
  constructor(props: LoveLetterLobbyProps) {
    super(props);
    this.state = {
      usernameList: props.usernameList,
      ready: false,
      // TODO:
      // gameStarted: false,
      gameStarted: true,
      // TODO:
      // gameState: null,
      gameState: {
        message: "Select a card",
        visibleCards: [guard, priest],
        discardCards: [],
        status: PlayerStatus.SELECTING_CARD,
      },
    };
  }

  componentDidMount() {
    this.props.socket.subscribeToGameState(this.onGameState.bind(this));
  }

  onGameState(payload: gameStateEvent) {
    this.setState({ gameStarted: true, gameState: payload });
  }

  onReady() {
    if (!this.state.ready) {
      this.props.socket.readyPlayer({ username: this.props.username });
    }
    this.setState({ ready: !this.state.ready });
  }

  render() {
    return !this.state.gameStarted || !this.state.gameState ? (
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
      <LoveLetterGameState
        socket={this.props.socket}
        username={this.props.username}
        gameState={this.state.gameState}
      />
    );
  }
}
