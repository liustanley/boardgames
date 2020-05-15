import React, { Fragment } from "react";
import "./LoveLetterLobby.css";
import { LoveLetterColors } from "../models/constants";
import { SocketService } from "../services/SocketService";
import { ChatContainer } from "../chat/ChatContainer";
import { GameStateEvent, PlayerStatus } from "../models/types";
import { LoveLetterGameState } from "./LoveLetterGameState";
import { Card } from "./Card";

interface LoveLetterLobbyProps {
  usernameList: string[];
  socket: SocketService;
  username: string;
}

interface LoveLetterLobbyState {
  usernameList: string[];
  gameStarted: boolean;
  ready: boolean;
  gameState: GameStateEvent | null;
}

// TODO:
const deck = [
  Card.GUARD,
  Card.HANDMAID,
  Card.KING,
  Card.GUARD,
  Card.PRINCE,
  Card.PRINCE,
  Card.GUARD,
  Card.PRIEST,
  Card.BARON,
  Card.GUARD,
  Card.PRINCESS,
  Card.PRIEST,
  Card.BARON,
];
const dillon = {
  id: "1",
  username: "Dillon",
  immune: true,
  status: PlayerStatus.WAITING,
};
const alex = {
  id: "2",
  username: "Alex",
  immune: false,
  status: PlayerStatus.WAITING,
};
const christina = {
  id: "3",
  username: "Christina",
  immune: false,
  status: PlayerStatus.WAITING,
};
const annette = {
  id: "4",
  username: "Annette",
  immune: false,
  status: PlayerStatus.WAITING,
  selfSelectable: false,
};

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
      //   visibleCards: [Card.PRIEST, Card.KING],
      //   discardCards: deck,
      //   status: PlayerStatus.SELECTING_CARD,
      // },
      // gameState: {
      //   message: "It's Stanley's turn",
      //   visibleCards: [Card.PRINCESS],
      //   discardCards: deck,
      //   status: PlayerStatus.WAITING,
      // },
      // gameState: {
      //   message: "Stanley compared cards with you and lost!",
      //   visibleCards: [Card.PRINCE, Card.COUNTESS],
      //   discardCards: deck,
      //   status: PlayerStatus.WAITING,
      // },
      // gameState: {
      //   message: "You are viewing Stanley's card",
      //   visibleCards: [Card.KING],
      //   discardCards: deck,
      //   status: PlayerStatus.VIEWING_CARD,
      // },
      // gameState: {
      //   message: "You compared cards with Stanley and won!",
      //   visibleCards: [Card.HANDMAID, Card.PRIEST],
      //   discardCards: deck,
      //   status: PlayerStatus.COMPARING_CARDS,
      // },
      // gameState: {
      //   message: "Select a player",
      //   visibleCards: [],
      //   discardCards: deck,
      //   visiblePlayers: [dillon, alex, christina, annette],
      //   status: PlayerStatus.SELECTING_PLAYER,
      // },
      gameState: {
        message: "Select a player and a card",
        visibleCards: [],
        discardCards: deck,
        visiblePlayers: [dillon, alex, christina, annette],
        status: PlayerStatus.GUESSING_CARD,
      },
    };
  }

  componentDidMount() {
    this.props.socket.subscribeToGameState(this.onGameState.bind(this));
  }

  onGameState(payload: GameStateEvent) {
    this.setState({ gameStarted: true, gameState: payload });
  }

  onReady() {
    if (!this.state.ready) {
      this.props.socket.readyPlayer({ username: this.props.username });
      this.setState({ ready: true });
    }
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
