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
  ReadyStatus,
  GameOverEvent,
} from "./types";

export class LoveLetterController {
  private io: SocketIO.Server;
  private port: string | number;
  private model: LoveLetterModel;

  constructor(server: Server, port: string | number) {
    this.port = port;
    this.model = new LoveLetterModel(DECK);
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
    if (this.model.getGameProgressState()) {
      this.io.to(socketId).emit("lobby", {
        success: false,
        usernameList: [],
      });
    } else {
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
    }
  };

  /**
   * Listener for readyPlayer events, also responsible for starting the game and sending first game state.
   * Also responsible for restarting rounds/games.
   */
  private onReadyPlayer = (res: ReadyPlayerEvent) => {
    this.model.incrementNumReady();
    let players: Player[] = this.model.getPlayers();

    // For now, game action will be prevented when only one person readys up.
    // This can be transformed into an event to display on the frontend later.
    if (
      this.model.getNumReady() === players.length &&
      this.model.getNumReady() !== 1
    ) {
      if (res.status === ReadyStatus.GAME_START) {
        this.model.startGame();
        this.sendGameState();
      } else if (res.status === ReadyStatus.ROUND_START) {
        this.model.resetRound();
        this.model.startGame();
        this.sendGameState();
      } else if (res.status === ReadyStatus.GAME_RESTART) {
        this.model.resetGame();
        this.model.startGame();
        this.sendGameState();
      }

      this.model.resetNumReady();
    }
  };

  /**
   * Sends the given death message if it is not empty.
   * @param deathMessage  the death message to emit
   */
  private sendDeathMessage(deathMessage: string) {
    if (deathMessage !== "") {
      this.io.emit(ChatEvent.MESSAGE, { author: "God", message: deathMessage });
    }
  }

  /**
   * Listener for selectCard events, alters the model accordingly.
   * @param res the response object of type SelectCardEvent
   */
  private onSelectCard = (res: SelectCardEvent) => {
    let selected: Card = Card.correct(res.card);
    this.model.selectCard(res.username, selected);

    // These cards all don't require a Play action, and just progress to the next turn.
    if (
      selected === Card.HANDMAID ||
      selected === Card.COUNTESS ||
      selected === Card.PRINCESS
    ) {
      this.sendDeathMessage(this.model.getDeathMessage());

      if (this.model.roundOver()) {
        this.model.gameOver()
          ? this.sendGameOverState()
          : this.sendRoundOverState();
      } else {
        this.model.nextTurn();
        this.sendGameState();
      }
    } else {
      this.sendGameState();
    }
  };

  /**
   * Listener for playCard events, alters the model accordingly.
   * @param res the response object of type PlayCardEvent
   */
  private onPlayCard = (res: PlayCardEvent) => {
    let guess: Card | undefined = res.guess
      ? Card.correct(res.guess)
      : undefined;
    this.model.playCard(res.username, res.target, guess);

    let lastPlayed: Card = this.model.getLastPlayed();

    if (
      (lastPlayed === Card.PRIEST || lastPlayed === Card.BARON) &&
      res.target
    ) {
      this.sendGameState();
    } else if (this.model.roundOver()) {
      this.sendDeathMessage(this.model.getDeathMessage());
      this.model.gameOver()
        ? this.sendGameOverState()
        : this.sendRoundOverState();
    } else {
      this.sendDeathMessage(this.model.getDeathMessage());
      this.model.nextTurn();
      this.sendGameState();
    }
  };

  /**
   * Listener for confirm events
   * @param res the response object
   */
  private onConfirm = (res: ConfirmEvent) => {
    this.model.confirmPlay(res.username);
    this.sendDeathMessage(this.model.getDeathMessage());

    if (this.model.roundOver()) {
      this.model.gameOver()
        ? this.sendGameOverState()
        : this.sendRoundOverState();
    } else {
      this.model.nextTurn();
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
   * Sends each client the model's game over state.
   */
  private sendGameOverState(): void {
    let players: Player[] = this.model.getPlayers();
    let message: string = this.model.getMessage();

    let gameOver: GameOverEvent = {
      players: players,
      message: message,
    };

    for (let p of players) {
      this.io.to(p.id).emit("gameOver", gameOver);
    }
  }

  /**
   * Removes the disconnected player from the game and sends everyone to a new lobby.
   * @param socketId the socket id of the disconnected player
   */
  private onDisconnectPlayer(socketId: string): void {
    let players: Player[] = this.model.getPlayers();
    let disconnected: Player | undefined = players.find(
      (player) => player.id === socketId
    );
    if (disconnected) {
      this.io.emit(ChatEvent.MESSAGE, {
        author: disconnected.username,
        message: "has left the game.",
      });
    }

    this.model.removePlayer(socketId);
    this.model.resetGame();

    players = this.model.getPlayers();
    let usernames: string[] = [];
    let socketIds: string[] = [];
    for (let p of players) {
      usernames.push(p.username);
      socketIds.push(p.id);
    }

    let lobby: LobbyEvent = {
      success: true,
      usernameList: usernames,
      reset: true,
    };
    for (let id of socketIds) {
      this.io.to(id).emit("lobby", lobby);
    }

    console.log("Client disconnected");
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

      socket.on("readyPlayer", (res: ReadyPlayerEvent) =>
        this.onReadyPlayer(res)
      );

      socket.on("selectCard", (res: SelectCardEvent) => this.onSelectCard(res));

      socket.on("playCard", (res: PlayCardEvent) => this.onPlayCard(res));

      socket.on("confirmEvent", (res: ConfirmEvent) => this.onConfirm(res));

      socket.on(ChatEvent.MESSAGE, this.onMessage);

      socket.on(ChatEvent.DISCONNECT, () => {
        this.onDisconnectPlayer(socket.id);
      });
    });
  }
}
