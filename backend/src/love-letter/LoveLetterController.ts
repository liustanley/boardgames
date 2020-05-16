import * as socketIo from "socket.io";
import { ChatEvent } from "../types/constants";
import { ChatMessage } from "../types/types";
import { Server } from "http";
import { LoveLetterModel } from "./LoveLetterModel";
import { Card } from "./Card";
import { Player } from "./Player";
import { DECK } from "./constants";

export class LoveLetterController {
  private io: SocketIO.Server;
  private port: string | number;
  private model: LoveLetterModel;

  constructor(server: Server, port: string | number) {
    this.port = port;
    this.model = new LoveLetterModel(DECK); // TODO
    this.initSocket(server);
    this.listen();
  }

  /**
   * Initializes socketIO instance.
   */
  private initSocket(server: Server): void {
    this.io = socketIo(server);
  }

  /**
   * Listener for message events. Emits the given message to all connected clients via a message event.
   * @param m the given Chat Message to be emitted
   */
  private onMessage = (m: ChatMessage): void => {
    console.log("[server](message): %s", JSON.stringify(m));

    // Emits the ChatMessage to all connected clients via a MESSAGE event.
    this.io.emit(ChatEvent.MESSAGE, m);
  };

  /**
   * Listener for registerPlayer event. Adds players to the model and sends back lobby events.
   * @param socketId  the socketId of the client registering a player
   * @param res       the response object, containing the client username
   */
  private onRegisterPlayer = (socketId: string, res: { username: string }) => {
    let success: boolean = this.model.addPlayer(socketId, res.username);
    let players: Player[] = this.model.getPlayers();
    let usernames: string[] = [];
    let socketIds: string[] = [];
    for (let p of players) {
      usernames.push(p.username);
      socketIds.push(p.id);
    }

    let lobby = {
      success: success,
      usernameList: usernames,
    };
    for (let id of socketIds) {
      this.io.to(id).emit("lobby", lobby);
    }
  };

  /**
   * Opens up communication to our server and Socket.io events.
   */
  private listen(): void {
    this.io.on(ChatEvent.CONNECT, (socket: socketIo.Socket) => {
      console.log("Connected client on port %s.", this.port);

      socket.on("registerPlayer", (res: { username: string }) =>
        this.onRegisterPlayer(socket.id, res)
      );

      socket.on(ChatEvent.MESSAGE, this.onMessage);

      socket.on(ChatEvent.DISCONNECT, () => {
        console.log("Client disconnected");
      });
    });
  }
}
