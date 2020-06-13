import io from "socket.io-client";
import {
  ChatMessageEvent,
  RegisterPlayerEvent,
  LobbyEvent,
  ReadyPlayerEvent,
  GameStateEvent,
  SelectCardEvent,
  ConfirmEvent,
  PlayCardEvent,
  RoundOverEvent,
  GameOverEvent,
  HighlightEvent,
} from "../models/LoveLetterTypes";
import { CreateGameEvent, JoinGameEvent } from "../models/GameTypes";

/**
 * Represents a service object that manages socket connection to the server.
 */
export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  /**
   * Initializes this class's socket connection.
   */
  public init(): SocketService {
    console.log("initiating socket service");
    // this.socket = io("https://tranquil-river-48506.herokuapp.com");
    this.socket = io("localhost:8080");
    return this;
  }

  createGame(payload: CreateGameEvent, callback: Function) {
    console.log("creating game - " + payload.gameType);
    this.socket.emit("createGame", payload, callback);
  }

  joinGame(payload: JoinGameEvent, callback: Function) {
    console.log("joining game - " + payload.gameType + " - " + payload.roomId);
    this.socket.emit("joinGame", payload, callback);
  }

  registerPlayer(payload: RegisterPlayerEvent) {
    console.log("registering player: " + payload.username);
    this.socket.emit("registerPlayer", payload);
  }

  subscribeToLobby(callback: (result: LobbyEvent) => void) {
    this.socket.on("lobby", (result: LobbyEvent) => callback(result));
  }

  readyPlayer(payload: ReadyPlayerEvent) {
    console.log("ready player: " + payload.username + " - " + payload.status);
    this.socket.emit("readyPlayer", payload);
  }

  subscribeToGameState(callback: (result: GameStateEvent) => void) {
    this.socket.on("gameState", (result: GameStateEvent) => callback(result));
  }

  selectCard(payload: SelectCardEvent) {
    console.log("selecting card: " + payload.username + " - " + payload.card);
    this.socket.emit("selectCard", payload);
  }

  playCard(payload: PlayCardEvent) {
    console.log(
      "playing card: " + payload.username + " targeting: " + payload.target
    );
    this.socket.emit("playCard", payload);
  }

  confirm(payload: ConfirmEvent) {
    console.log("confirming: " + payload.username);
    this.socket.emit("confirmEvent", payload);
  }

  highlight(payload: HighlightEvent) {
    console.log(
      "highlighting: " +
        payload.username +
        " - " +
        payload.player +
        " - " +
        payload.card
    );
    this.socket.emit("highlight", payload);
  }

  subscribeToRoundOver(callback: (result: RoundOverEvent) => void) {
    this.socket.on("roundOver", (result: RoundOverEvent) => callback(result));
  }

  subscribeToGameOver(callback: (result: GameOverEvent) => void) {
    this.socket.on("gameOver", (result: GameOverEvent) => callback(result));
  }

  /**
   * Send a message for the server to broadcast.
   */
  public sendChatMessage(message: ChatMessageEvent): void {
    console.log("emitting chat message: " + message);
    this.socket.emit("message", message);
  }

  /**
   * Listens for incoming chat messages.
   * @param callback function to call upon receiving a chat message.
   */
  public subscribeToChat(callback: (message: ChatMessageEvent) => void) {
    this.socket.on("message", (m: ChatMessageEvent) => callback(m));
  }

  /**
   * Disconnect - used when unmounting
   */
  public disconnect(): void {
    this.socket.disconnect();
  }
}
