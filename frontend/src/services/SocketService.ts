import io from "socket.io-client";
import { ChatMessage, registerPlayer, lobby } from "../models/types";

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

  registerPlayer(username: registerPlayer) {
    console.log("registering player: " + username);
    this.socket.emit("registerPlayer", username);
  }

  subscribeToLobby(callback: (result: lobby) => void) {
    this.socket.on("lobby", (result: lobby) => callback(result));
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
