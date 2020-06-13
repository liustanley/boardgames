import * as socketIo from "socket.io";
import { Server } from "http";
import { CreateGameEvent, JoinGameEvent, ChatMessage } from "../types/types";
import { ChatEvent } from "../types/constants";
import { LoveLetterController } from "../love-letter/LoveLetterController";

export class HomePageController {
  private io: SocketIO.Server;
  private port: string | number;
  private sockets: string[];
  private rooms: string[];
  private socketToRoom: Map<string, string>;

  constructor(server: Server, port: string | number) {
    this.port = port;
    this.sockets = [];
    this.rooms = [];
    this.socketToRoom = new Map<string, string>();
    this.initSocket(server);
    this.listen();
  }

  /**
   * Initializes socketIO instance.
   */
  private initSocket(server: Server): void {
    this.io = socketIo(server);
  }

  private makeid(length: number) {
    var result = "";
    // var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var characters = "ABCD";
    var charactersLength = characters.length;

    if (this.rooms.length === Math.pow(charactersLength, length)) {
      throw new Error("Too many rooms!");
    }

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private onCreateGame(
    data: CreateGameEvent,
    socket: socketIo.Socket,
    callback: Function
  ) {
    try {
      let code: string;
      do {
        code = this.makeid(1);
        console.log("Trying code: " + code);
      } while (this.rooms.includes(code));
      this.rooms.push(code);
      this.socketToRoom.set(socket.id, code);

      // Leave all other games before joining
      Object.keys(socket.rooms).forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.leave(roomId);
        }
      });
      socket.join(code, () =>
        console.log("JOIN " + JSON.stringify(socket.rooms))
      );
      callback(code);
    } catch (error) {
      console.log(error);
    }
  }

  private onJoinGame(
    data: JoinGameEvent,
    socket: socketIo.Socket,
    callback: Function
  ) {
    console.log("joining game");
    console.log(this.rooms);
    console.log(data.roomId);
    if (this.rooms.includes(data.roomId)) {
      this.socketToRoom.set(socket.id, data.roomId);
      Object.keys(socket.rooms).forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.leave(roomId);
        }
      });
      socket.join(data.roomId, () =>
        console.log("JOIN " + JSON.stringify(socket.rooms))
      );
      callback(true);
    } else {
      callback(false);
    }
  }

  private onDisconnect(socketId: string) {
    this.sockets.splice(this.sockets.indexOf(socketId), 1);
    const room = this.socketToRoom.get(socketId);
    if (room) {
      this.socketToRoom.delete(socketId);
    }
  }

  /**
   * Opens up communication to our server and Socket.io events.
   */
  private listen(): void {
    const loveletter: LoveLetterController = new LoveLetterController(this.io);

    this.io.on("connect", (socket: socketIo.Socket) => {
      console.log("Connected client on port %s.", this.port);
      this.sockets.push(socket.id);

      socket.on("createGame", (data: CreateGameEvent, callback: Function) => {
        this.onCreateGame(data, socket, callback);
      });

      socket.on("joinGame", (data: JoinGameEvent, callback: Function) => {
        this.onJoinGame(data, socket, callback);
      });

      socket.on(ChatEvent.MESSAGE, (res: ChatMessage) => {
        console.log("MESSAGE " + JSON.stringify(socket.rooms));
        loveletter.onMessage(res, socket);
      });

      socket.on("disconnect", () => {
        this.onDisconnect(socket.id);
        console.log("client disconnected");
      });
    });
  }
}
