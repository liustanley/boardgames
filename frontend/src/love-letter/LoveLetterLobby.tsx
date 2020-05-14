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
const baron = { value: 3, key: "baron", description: "compare cards" };
const handmaid = { value: 4, key: "handmaid", description: "protection" };
const prince = { value: 5, key: "prince", description: "draw card" };
const king = { value: 6, key: "king", description: "swap cards" };
const countess = { value: 7, key: "countess", description: "have to play" };
const princess = { value: 8, key: "princess", description: "lose" };
const deck = [
  guard,
  priest,
  baron,
  handmaid,
  prince,
  king,
  countess,
  baron,
  prince,
  guard,
  priest,
  baron,
  guard,
];

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
      // gameState: {
      //   message: "Select a card",
      //   visibleCards: [guard, priest],
      //   discardCards: [
      //     guard,
      //     priest,
      //     baron,
      //     handmaid,
      //     prince,
      //     king,
      //     countess,
      //     princess,
      //     baron,
      //     prince,
      //     handmaid,
      //     guard,
      //     guard,
      //     priest,
      //     baron,
      //     guard,
      //   ],
      //   status: PlayerStatus.SELECTING_CARD,
      // },
      // gameState: {
      //   message: "It's Stanley's turn",
      //   visibleCards: [princess],
      //   discardCards: deck,
      //   status: PlayerStatus.WAITING,
      // },
      // gameState: {
      //   message: "You are viewing Stanley's card",
      //   visibleCards: [king],
      //   discardCards: deck,
      //   status: PlayerStatus.VIEWING_CARD,
      // },
      gameState: {
        message: "You compared cards with Stanley and won!",
        visibleCards: [handmaid, guard],
        discardCards: deck,
        status: PlayerStatus.COMPARING_CARDS,
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
