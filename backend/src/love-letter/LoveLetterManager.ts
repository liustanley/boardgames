import { RegisterPlayerPayload } from "./types";
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
}
