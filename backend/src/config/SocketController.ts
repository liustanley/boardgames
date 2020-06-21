import * as socketIo from "socket.io";
import { Server } from "http";
import {
  CreateGameEvent,
  JoinGameEvent,
  ChatMessage,
  Games,
  ReJoinEvent,
} from "../types/types";
import { SocketEvent } from "../types/constants";
import {
  RegisterPlayerPayload as LL_RegisterPlayerPayload,
  ReadyPlayerPayload as LL_ReadyPlayerPayload,
  SelectCardPayload as LL_SelectCardPayload,
  PlayCardPayload as LL_PlayCardPayload,
  ConfirmPayload as LL_ConfirmPayload,
  HighlightPayload as LL_HighlightPayload,
} from "../love-letter/types";
import { LoveLetterManager } from "../love-letter/LoveLetterManager";

export class SocketController {
  private io: SocketIO.Server;
  private port: string | number;
  private sockets: string[];
  private rooms: string[];
  private socketToRoom: Map<string, string>;
  private socketToGame: Map<string, Games>;
  private loveLetterManager: LoveLetterManager;

  constructor(server: Server, port: string | number) {
    this.port = port;
    this.sockets = [];
    this.rooms = [];
    this.socketToRoom = new Map<string, string>();
    this.socketToGame = new Map<string, Games>();
    this.initSocket(server);
    this.loveLetterManager = new LoveLetterManager(this.io);
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
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;

    if (this.rooms.length === Math.pow(charactersLength, length)) {
      throw new Error("Too many rooms!");
    }

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private onReJoin(
    payload: ReJoinEvent,
    socket: socketIo.Socket,
    callback: Function
  ) {
    switch (payload.game) {
      case Games.LOVE_LETTER:
        const success = this.loveLetterManager.rejoinPlayer(
          payload.room,
          payload.prevSocketId,
          socket.id,
          callback
        );
        if (success) {
          this.socketToGame.set(socket.id, Games.LOVE_LETTER);
          this.socketToRoom.set(socket.id, payload.room);
          socket.join(payload.room);
        } else {
          console.log("Re-join unsuccessful");
        }
        break;
      case Games.CODENAMES:
        break;
    }
  }

  private onCreateGame(
    payload: CreateGameEvent,
    socket: socketIo.Socket,
    callback: Function
  ) {
    try {
      let code: string;

      do {
        code = this.makeid(4);
        console.log("Trying code: " + code);
      } while (this.rooms.includes(code));

      this.rooms.push(code);
      this.socketToRoom.set(socket.id, code);
      this.socketToGame.set(socket.id, payload.gameType);

      switch (payload.gameType) {
        case Games.LOVE_LETTER:
          this.loveLetterManager.createGame(code);
          break;
        case Games.CODENAMES:
          // TODO
          break;
      }

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
    payload: JoinGameEvent,
    socket: socketIo.Socket,
    callback: Function
  ) {
    console.log("joining game");
    console.log(this.rooms);
    console.log(payload.roomId);
    if (this.rooms.includes(payload.roomId)) {
      this.socketToRoom.set(socket.id, payload.roomId);
      this.socketToGame.set(socket.id, payload.gameType);
      Object.keys(socket.rooms).forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.leave(roomId);
        }
      });
      socket.join(payload.roomId, () =>
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
    const game = this.socketToGame.get(socketId);
    if (room) this.socketToRoom.delete(socketId);
    if (game) this.socketToGame.delete(socketId);
    // TODO - not going to reset game on disconnect in future, so for now disconnecting does nothing to model
  }

  private onChatMessage(payload: ChatMessage, socket: SocketIO.Socket) {
    const room = this.socketToRoom.get(socket.id);
    this.io.to(room).emit(SocketEvent.MESSAGE, payload);
  }

  /**
   * Opens up communication to our server and Socket.io events.
   */
  private listen(): void {
    this.io.on(SocketEvent.CONNECT, (socket: socketIo.Socket) => {
      console.log("Connected client on port %s.", this.port);
      this.sockets.push(socket.id);

      socket.on(
        SocketEvent.REJOIN_GAME,
        (payload: ReJoinEvent, callback: Function) => {
          this.onReJoin(payload, socket, callback);
        }
      );

      socket.on(
        SocketEvent.CREATE_GAME,
        (payload: CreateGameEvent, callback: Function) => {
          this.onCreateGame(payload, socket, callback);
        }
      );

      socket.on(
        SocketEvent.JOIN_GAME,
        (payload: JoinGameEvent, callback: Function) => {
          this.onJoinGame(payload, socket, callback);
        }
      );

      socket.on(SocketEvent.MESSAGE, (payload: ChatMessage) => {
        this.onChatMessage(payload, socket);
      });

      socket.on(SocketEvent.DISCONNECT, () => {
        this.onDisconnect(socket.id);
        console.log("client disconnected");
      });

      socket.on(
        SocketEvent.LL_REGISTER_PLAYER,
        (payload: LL_RegisterPlayerPayload) => {
          const room = this.socketToRoom.get(socket.id);
          this.loveLetterManager.registerPlayer(room, socket.id, payload);
        }
      );

      socket.on(
        SocketEvent.LL_READY_PLAYER,
        (payload: LL_ReadyPlayerPayload) => {
          const room = this.socketToRoom.get(socket.id);
          this.loveLetterManager.readyPlayer(room, socket.id, payload);
        }
      );

      socket.on(SocketEvent.LL_SELECT_CARD, (payload: LL_SelectCardPayload) => {
        const room = this.socketToRoom.get(socket.id);
        this.loveLetterManager.selectCard(room, socket.id, payload);
      });

      socket.on(SocketEvent.LL_PLAY_CARD, (payload: LL_PlayCardPayload) => {
        const room = this.socketToRoom.get(socket.id);
        this.loveLetterManager.playCard(room, socket.id, payload);
      });

      socket.on(SocketEvent.LL_CONFIRM, (payload: LL_ConfirmPayload) => {
        const room = this.socketToRoom.get(socket.id);
        this.loveLetterManager.confirm(room, socket.id, payload);
      });

      socket.on(SocketEvent.LL_HIGHLIGHT, (payload: LL_HighlightPayload) => {
        const room = this.socketToRoom.get(socket.id);
        this.loveLetterManager.highlight(room, socket.id, payload);
      });
    });
  }
}
