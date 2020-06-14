import {
  RegisterPlayerPayload,
  ReadyPlayerPayload,
  SelectCardPayload,
  PlayCardPayload,
  HighlightPayload,
} from "./types";
import { LoveLetterController } from "./LoveLetterController";

export class LoveLetterManager {
  private io: SocketIO.Server;
  private codeToGame: Map<string, LoveLetterController>;

  constructor(io: SocketIO.Server) {
    this.io = io;
    this.codeToGame = new Map<string, LoveLetterController>();
  }

  createGame(room: string) {
    this.codeToGame.set(room, new LoveLetterController(this.io, room));
  }

  registerPlayer(
    room: string,
    socketId: string,
    payload: RegisterPlayerPayload
  ) {
    const game = this.codeToGame.get(room);
    game.registerPlayer(socketId, payload);
  }

  readyPlayer(room: string, socketId: string, payload: ReadyPlayerPayload) {
    const game = this.codeToGame.get(room);
    game.readyPlayer(socketId, payload);
  }

  selectCard(room: string, socketId: string, payload: SelectCardPayload) {
    const game = this.codeToGame.get(room);
    game.selectCard(socketId, room, payload);
  }

  playCard(room: string, socketId: string, payload: PlayCardPayload) {
    const game = this.codeToGame.get(room);
    game.playCard(socketId, room, payload);
  }

  confirm(room: string, socketId: string, payload: PlayCardPayload) {
    const game = this.codeToGame.get(room);
    game.confirm(socketId, room, payload);
  }

  highlight(room: string, socketId: string, payload: HighlightPayload) {
    const game = this.codeToGame.get(room);
    game.highlight(socketId, room, payload);
  }
}
