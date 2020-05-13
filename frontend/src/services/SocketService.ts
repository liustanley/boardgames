import io from "socket.io-client";
import {
  ChatMessage,
  registerPlayerEvent,
  lobbyEvent,
  readyPlayerEvent,
  gameStateEvent,
  playCardEvent,
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

  registerPlayer(payload: registerPlayerEvent) {
    console.log("registering player: " + payload.username);
    this.socket.emit("registerPlayer", payload);
  }

  subscribeToLobby(callback: (result: lobbyEvent) => void) {
    this.socket.on("lobby", (result: lobbyEvent) => callback(result));
  }

  readyPlayer(payload: readyPlayerEvent) {
    console.log("ready player: " + payload.username);
    this.socket.emit("readyPlayer", payload);
  }

  subscribeToGameState(callback: (result: gameStateEvent) => void) {
    this.socket.on("gameState", (result: gameStateEvent) => callback(result));
  }

  playCard(payload: playCardEvent) {
    console.log("playing card: " + payload.username + " - " + payload.card);
    this.socket.emit("playCard", payload);
  }

  /**
   * Send a message for the server to broadcast.
   */
  public sendChatMessage(message: ChatMessage): void {
    console.log("emitting chat message: " + message);
    this.socket.emit("message", message);
  }

  /**
   * Listens for incoming chat messages.
   * @param callback function to call upon receiving a chat message.
   */
  public subscribeToChat(callback: (message: ChatMessage) => void) {
    this.socket.on("message", (m: ChatMessage) => callback(m));
  }

  /**
   * Disconnect - used when unmounting
   */
  public disconnect(): void {
    this.socket.disconnect();
  }
}
