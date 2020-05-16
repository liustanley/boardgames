import io from "socket.io-client";
import {
  ChatMessageEvent,
  RegisterPlayerEvent,
  LobbyEvent,
  ReadyPlayerEvent,
  GameStateEvent,
  PlayCardEvent,
  ConfirmEvent,
  SelectPlayerEvent,
  GuessCardEvent,
  RoundOverEvent,
} from "../models/types";

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
    this.socket = io("localhost:8080");
    return this;
  }

  registerPlayer(payload: RegisterPlayerEvent) {
    console.log("registering player: " + payload.username);
    this.socket.emit("registerPlayer", payload);
  }

  subscribeToLobby(callback: (result: LobbyEvent) => void) {
    this.socket.on("lobby", (result: LobbyEvent) => callback(result));
  }

  readyPlayer(payload: ReadyPlayerEvent) {
    console.log("ready player: " + payload.username);
    this.socket.emit("readyPlayer", payload);
  }

  subscribeToGameState(callback: (result: GameStateEvent) => void) {
    this.socket.on("gameState", (result: GameStateEvent) => callback(result));
  }

  playCard(payload: PlayCardEvent) {
    console.log("playing card: " + payload.username + " - " + payload.card);
    this.socket.emit("playCard", payload);
  }

  confirm(payload: ConfirmEvent) {
    console.log("confirming: " + payload.username);
    this.socket.emit("confirm", payload);
  }

  selectPlayer(payload: SelectPlayerEvent) {
    console.log(
      "selecting: " + payload.username + " -> " + payload.player.username
    );
    this.socket.emit("selectPLayer", payload);
  }

  guessCard(payload: GuessCardEvent) {
    console.log(
      "guessing card: " +
        payload.username +
        " -> " +
        payload.player.username +
        " - " +
        payload.card
    );
  }

  subscribeToRoundOver(callback: (result: RoundOverEvent) => void) {
    this.socket.on("roundOver", (result: RoundOverEvent) => callback(result));
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
