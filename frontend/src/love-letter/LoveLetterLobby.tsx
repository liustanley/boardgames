import React, { Fragment } from "react";
import "./LoveLetterLobby.css";
import { LoveLetterColors } from "../models/LoveLetterTypes";
import { SocketService } from "../services/SocketService";
import { ChatContainer } from "../chat/ChatContainer";
import {
  GameStatePayload,
  RoundOverPayload,
  ReadyStatus,
  GameOverPayload,
} from "../models/LoveLetterTypes";
import { LoveLetterGameState } from "./LoveLetterGameState";
import { Card } from "./Card";
import { LoveLetterDeckCard } from "./LoveLetterDeckCard";
import LoveLetterCheatSheet from "./LoveLetterCheatSheet";
import Cookies from "universal-cookie";

interface LoveLetterLobbyProps {
  usernameList: string[];
  socket: SocketService;
  cookies: Cookies;
  username: string;
  reset?: boolean;
  setReset: Function;
  roomCode: any;
}

interface LoveLetterLobbyState {
  usernameList: string[];
  gameStarted: boolean;
  ready: boolean;
  gameState: GameStatePayload | null;
  roundOver: boolean;
  roundState: RoundOverPayload | null;
  gameOver: boolean;
  gameOverState: GameOverPayload | null;
  cheatSheetVisible: boolean;
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
      gameState: null,
      roundOver: false,
      roundState: null,
      gameOver: false,
      gameOverState: null,
      cheatSheetVisible: false,
    };
  }

  componentDidMount() {
    this.props.socket.LOVE_LETTER.subscribeToGameState(
      this.onGameState.bind(this)
    );
    this.props.socket.LOVE_LETTER.subscribeToRoundOver(
      this.onRoundOver.bind(this)
    );
    this.props.socket.LOVE_LETTER.subscribeToGameOver(
      this.onGameOver.bind(this)
    );
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

  onGameState(payload: GameStatePayload) {
    this.props.cookies.set("socketId", this.props.socket.getId(), {
      path: "/",
      maxAge: 600,
    });
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
      this.props.socket.LOVE_LETTER.readyPlayer({
        username: this.props.username,
        status: ReadyStatus.GAME_START,
      });
      this.setState({ ready: true });
    }
  }

  onReadyContinue() {
    if (!this.state.ready) {
      this.props.socket.LOVE_LETTER.readyPlayer({
        username: this.props.username,
        status: ReadyStatus.ROUND_START,
      });
    }
    this.setState({ ready: true });
  }

  onReadyRestart() {
    if (!this.state.ready) {
      this.props.socket.LOVE_LETTER.readyPlayer({
        username: this.props.username,
        status: ReadyStatus.GAME_RESTART,
      });
    }
    this.setState({ ready: true });
  }

  onRoundOver(payload: RoundOverPayload) {
    this.setState({ roundOver: true, roundState: payload, ready: false });
  }

  onGameOver(payload: GameOverPayload) {
    this.setState({
      gameOver: true,
      gameStarted: true,
      gameOverState: payload,
      ready: false,
    });
  }

  openCheatSheet() {
    this.setState({
      cheatSheetVisible: true,
    });
  }

  closeCheatSheet() {
    this.setState({
      cheatSheetVisible: false,
    });
  }

  render() {
    return (
      <Fragment>
        {this.state.cheatSheetVisible && (
          <LoveLetterCheatSheet
            closeOverlay={this.closeCheatSheet.bind(this)}
          />
        )}
        {!this.state.gameStarted && !this.state.roundOver && (
          <Fragment>
            <div className="loveLetterLobby">
              <hr color={LoveLetterColors.BACKGROUND_BLUE}></hr>
              <b>Room Code: {this.props.roomCode.room_id}</b>
              <hr color={LoveLetterColors.BACKGROUND_BLUE}></hr>
              <br></br>
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
        <div className="loveLetterChat">
          <ChatContainer
            socket={this.props.socket}
            username={this.props.username}
            size="big"
            gameInProgress={
              this.state.gameStarted &&
              !!this.state.gameState &&
              !this.state.roundOver &&
              !this.state.gameOver
            }
            openCheatSheet={this.openCheatSheet.bind(this)}
          />
        </div>
      </Fragment>
    );
  }
}
