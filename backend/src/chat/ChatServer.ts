import * as socketIo from "socket.io";
import { ChatMessage } from "../types/types";
import { Server } from "http";
import { SocketEvent } from "../types/constants";

export class ChatServer {
  private io: SocketIO.Server;
  private port: string | number;

  constructor(server: Server, port: string | number) {
    this.port = port;
    this.initSocket(server);
    this.listen();
  }

  /**
   * Initializes socketIO instance.
   */
  private initSocket(server: Server): void {
    this.io = socketIo(server);
  }

  private onMessage = (m: ChatMessage): void => {
    console.log("[server](message): %s", JSON.stringify(m));

    // Emits the ChatMessage to all connected clients via a MESSAGE event.
    this.io.emit(SocketEvent.MESSAGE, m);
  };

  /**
   * Opens up communication to our server and Socket.io events.
   */
  private listen(): void {
    this.io.on(SocketEvent.CONNECT, (socket: socketIo.Socket) => {
      console.log("Connected client on port %s.", this.port);
      socket.on(SocketEvent.MESSAGE, this.onMessage);

      socket.on(SocketEvent.DISCONNECT, () => {
        console.log("Client disconnected");
      });
    });
  }
}
