import * as socketIo from "socket.io";
import { ChatEvent } from "../types/constants";
import { ChatMessage } from "../types/types";
import { Server } from "http";
import { LoveLetterModel } from "./LoveLetterModel";
import { Card } from "./Card";
import { Player } from "./Player";
import { DECK } from "./constants";
import {
  ConfirmEvent,
  GameState,
  LobbyEvent,
  PlayCardEvent,
  ReadyPlayerEvent,
  RegisterPlayerEvent,
  RoundOverEvent,
  SelectCardEvent,
} from "./types";

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
  private onRegisterPlayer = (socketId: string, res: RegisterPlayerEvent) => {
    let success: boolean = this.model.addPlayer(socketId, res.username);
    let players: Player[] = this.model.getPlayers();
    let usernames: string[] = [];
    let socketIds: string[] = [];
    for (let p of players) {
      usernames.push(p.username);
      socketIds.push(p.id);
    }

    let lobby: LobbyEvent = {
      success: success,
      usernameList: usernames,
    };
    for (let id of socketIds) {
      this.io.to(id).emit("lobby", lobby);
    }
  };

  /**
   * Listener for readyPlayer events, also responsible for starting the game and sending first game state.
   */
  private onReadyPlayer = () => {
    this.model.incrementNumReady();
    let players: Player[] = this.model.getPlayers();

    if (this.model.getNumReady() === players.length) {
      this.model.startGame();
      this.sendGameState();
    }
  };

  /**
   * Listener for selectCard events, alters the model accordingly.
   * @param res the response object of type SelectCardEvent
   */
  private onSelectCard = (res: SelectCardEvent) => {
    this.model.selectCard(res.username, res.card); // TODO: might have to correct this card input
    this.sendGameState();
  };

  /**
   * Listener for playCard events, alters the model accordingly.
   * @param res the response object of type PlayCardEvent
   */
  private onPlayCard = (res: PlayCardEvent) => {
    this.model.playCard(res.username, res.target, res.guess); // TODO: might have to correct this card input

    if (this.model.roundOver()) {
      this.sendRoundOverState();
    } else {
      this.sendGameState();
    }
  };

  /**
   * Listener for confirm events
   * @param res the response object
   */
  private onConfirm = (res: ConfirmEvent) => {
    this.model.confirmPlay(res.username);

    if (this.model.roundOver()) {
      this.sendRoundOverState();
    } else {
      this.sendGameState();
    }
  };

  /**
   * Sends each client their respective game state.
   */
  private sendGameState(): void {
    let players: Player[] = this.model.getPlayers();
    let gameState: GameState[] = this.model.gameState();

    for (let i: number = 0; i < players.length; i++) {
      this.io.to(players[i].id).emit("gameState", gameState[i]);
    }
    console.log(this.model.gameState());
  }

  /**
   * Sends each client the model's round over state.
   */
  private sendRoundOverState(): void {
    let players: Player[] = this.model.getPlayers();
    let message: string = this.model.getMessage();

    let roundOver: RoundOverEvent = {
      players: players,
      message: message,
    };

    for (let p of players) {
      this.io.to(p.id).emit("roundOver", roundOver);
    }
  }

  /**
   * Opens up communication to our server and Socket.io events.
   */
  private listen(): void {
    this.io.on(ChatEvent.CONNECT, (socket: socketIo.Socket) => {
      console.log("Connected client on port %s.", this.port);

      socket.on("registerPlayer", (res: RegisterPlayerEvent) =>
        this.onRegisterPlayer(socket.id, res)
      );

      socket.on("readyPlayer", (res: ReadyPlayerEvent) => this.onReadyPlayer());

      socket.on("selectCard", (res: SelectCardEvent) => this.onSelectCard(res));

      socket.on("playCard", (res: PlayCardEvent) => this.onPlayCard(res));

      socket.on("confirmEvent", (res: ConfirmEvent) => this.onConfirm(res));

      socket.on(ChatEvent.MESSAGE, this.onMessage);

      socket.on(ChatEvent.DISCONNECT, () => {
        console.log("Client disconnected");
      });
    });
  }
}
