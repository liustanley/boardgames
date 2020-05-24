import React, { Fragment } from "react";
import "./LoveLetterLobby.css";
import { LoveLetterColors } from "../models/constants";
import { SocketService } from "../services/SocketService";
import { ChatContainer } from "../chat/ChatContainer";
import {
  GameStateEvent,
  PlayerStatus,
  RoundOverEvent,
  ReadyStatus,
  GameOverEvent,
} from "../models/types";
import { LoveLetterGameState } from "./LoveLetterGameState";
import { Card } from "./Card";
import { LoveLetterDeckCard } from "./LoveLetterDeckCard";
import { read } from "fs";

interface LoveLetterLobbyProps {
  usernameList: string[];
  socket: SocketService;
  username: string;
  reset?: boolean;
  setReset: Function;
}

interface LoveLetterLobbyState {
  usernameList: string[];
  gameStarted: boolean;
  ready: boolean;
  gameState: GameStateEvent | null;
  roundOver: boolean;
  roundState: RoundOverEvent | null;
  gameOver: boolean;
  gameOverState: GameOverEvent | null;
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
  immune: false,
  status: PlayerStatus.WAITING,
  tokens: 2,
  card: Card.PRIEST,
};
const alex = {
  id: "2",
  username: "Alex",
  immune: false,
  status: PlayerStatus.DEAD,
  tokens: 1,
  card: Card.PRINCESS,
};
const christina = {
  id: "3",
  username: "Christina",
  immune: false,
  status: PlayerStatus.DEAD,
  tokens: 3,
  card: Card.KING,
};
const annette = {
  id: "4",
  username: "Annette",
  immune: false,
  status: PlayerStatus.WAITING,
  selfSelectable: false,
  tokens: 1,
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
      gameStarted: false,
      // gameStarted: true,
      // TODO:
      gameState: null,
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
      // gameState: {
      //   message: "Select a player and a card",
      //   visibleCards: [],
      //   discardCards: deck,
      //   visiblePlayers: [dillon, alex, christina, annette],
      //   status: PlayerStatus.GUESSING_CARD,
      // },
      roundOver: false,
      // roundOver: true,
      roundState: null,
      // roundState: {
      //   message: "Alex wins!",
      //   players: [dillon, alex, christina, annette],
      // },
      gameOver: false,
      // gameOver: true,
      gameOverState: null,
      // gameOverState: {
      //   message: "Christina wins!",
      //   players: [dillon, alex, christina, annette],
      // },
    };
  }

  componentDidMount() {
    this.props.socket.subscribeToGameState(this.onGameState.bind(this));
    this.props.socket.subscribeToRoundOver(this.onRoundOver.bind(this));
    this.props.socket.subscribeToGameOver(this.onGameOver.bind(this));
  }

  componentDidUpdate() {
    if (this.props.usernameList !== this.state.usernameList) {
      this.setState({ usernameList: this.props.usernameList });
    }
    if (this.props.reset === true) {
      this.setState({
        gameStarted: false,
        gameState: null,
        roundOver: false,
        roundState: null,
        gameOver: false,
        gameOverState: null,
        ready: false,
      });
      this.props.setReset();
    }
  }

  onGameState(payload: GameStateEvent) {
    payload.visibleCards = Card.correct(payload.visibleCards);
    payload.discardCards = Card.correct(payload.discardCards);

    this.setState({
      gameStarted: true,
      gameState: payload,
      roundOver: false,
      gameOver: false,
    });
  }

  onReadyStart() {
    if (!this.state.ready) {
      this.props.socket.readyPlayer({
        username: this.props.username,
        status: ReadyStatus.GAME_START,
      });
      this.setState({ ready: true });
    }
  }

  onReadyContinue() {
    if (!this.state.ready) {
      this.props.socket.readyPlayer({
        username: this.props.username,
        status: ReadyStatus.ROUND_START,
      });
    }
    this.setState({ ready: true });
  }

  onReadyRestart() {
    if (!this.state.ready) {
      this.props.socket.readyPlayer({
        username: this.props.username,
        status: ReadyStatus.GAME_RESTART,
      });
    }
    this.setState({ ready: true });
  }

  onRoundOver(payload: RoundOverEvent) {
    this.setState({ roundOver: true, roundState: payload, ready: false });
  }

  onGameOver(payload: GameOverEvent) {
    this.setState({ gameOver: true, gameOverState: payload, ready: false });
  }

  render() {
    return (
      <Fragment>
        {!this.state.gameStarted && !this.state.roundOver && (
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
              onClick={this.onReadyStart.bind(this)}
            >
              <b>{!this.state.ready ? "OK" : "Waiting for others"}</b>
            </div>
            <div className="loveLetterChat">
              <ChatContainer
                socket={this.props.socket}
                username={this.props.username}
              />
            </div>
          </Fragment>
        )}
        {this.state.gameStarted &&
          this.state.gameState &&
          !this.state.roundOver &&
          !this.state.gameOver && (
            <LoveLetterGameState
              socket={this.props.socket}
              username={this.props.username}
              gameState={this.state.gameState}
            />
          )}
        {this.state.roundOver && this.state.roundState && (
          <Fragment>
            <div className="roundOverContainer">
              <br></br>
              <hr color={LoveLetterColors.WHITE}></hr>
              <div className="gameMessage">
                <b>{this.state.roundState.message}</b>
              </div>
              <hr color={LoveLetterColors.WHITE}></hr>
              <br></br>
              <br></br>
              <br></br>
              <div className="playerList">
                <hr style={{ color: LoveLetterColors.WHITE, margin: 0 }}></hr>
                {this.state.roundState.players.map((player) => (
                  <Fragment>
                    <div
                      className="roundOverPlayerName"
                      style={{
                        background: LoveLetterColors.BACKGROUND_BLACK,
                      }}
                    >
                      {player.card && (
                        <LoveLetterDeckCard
                          number={player.card.value}
                          index={0}
                        />
                      )}
                      <b>
                        {player.username}{" "}
                        <span style={{ color: LoveLetterColors.RED }}>
                          {Array(player.tokens).fill("❤️").join(" ")}
                        </span>
                      </b>
                    </div>
                    <hr
                      style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                    ></hr>
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              className={!this.state.ready ? "readyButton" : "readiedButton"}
              onClick={this.onReadyContinue.bind(this)}
            >
              <b>{!this.state.ready ? "OK" : "Waiting for others"}</b>
            </div>
          </Fragment>
        )}
        {this.state.gameOver && this.state.gameOverState && (
          <Fragment>
            <div className="roundOverContainer">
              <br></br>
              <hr color={LoveLetterColors.WHITE}></hr>
              <div className="gameMessage">
                <b>{this.state.gameOverState.message}</b>
              </div>
              <hr color={LoveLetterColors.WHITE}></hr>
              <br></br>
              <br></br>
              <br></br>
              <div className="playerList">
                <hr style={{ color: LoveLetterColors.WHITE, margin: 0 }}></hr>
                {this.state.gameOverState.players.map((player) => (
                  <Fragment>
                    <div
                      className="roundOverPlayerName"
                      style={{
                        background: LoveLetterColors.BACKGROUND_BLACK,
                      }}
                    >
                      {player.card && (
                        <LoveLetterDeckCard
                          number={player.card.value}
                          index={0}
                        />
                      )}
                      <b>
                        {player.username}{" "}
                        <span style={{ color: LoveLetterColors.RED }}>
                          {Array(player.tokens).fill("❤️").join(" ")}
                        </span>
                      </b>
                    </div>
                    <hr
                      style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                    ></hr>
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              className={!this.state.ready ? "readyButton" : "readiedButton"}
              onClick={this.onReadyRestart.bind(this)}
            >
              <b>{!this.state.ready ? "Play Again" : "Waiting for others"}</b>
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
