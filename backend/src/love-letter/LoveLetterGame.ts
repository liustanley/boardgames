import * as socketIo from "socket.io";
import { ChatMessage } from "../types/types";
import { LoveLetterModel } from "./LoveLetterModel";
import { Card } from "./Card";
import { Player } from "./Player";
import { DECK } from "./constants";
import {
  GameState,
  LobbyPayload,
  PlayCardPayload,
  ReadyPlayerPayload,
  RegisterPlayerPayload,
  RoundOverPayload,
  SelectCardPayload,
  ReadyStatus,
  GameOverPayload,
  HighlightPayload,
  ConfirmPayload,
} from "./types";
import { SocketEvent } from "../types/constants";

export class LoveLetterGame {
  private io: SocketIO.Server;
  private port: string | number;
  private room: string;
  private model: LoveLetterModel;

  constructor(server: SocketIO.Server, room: string) {
    this.io = server;
    this.room = room;
    this.model = new LoveLetterModel(DECK);
  }

  /**
   * Listener for message events. Emits the given message to all connected clients via a message event.
   * @param m the given Chat Message to be emitted
   */
  public onMessage = (m: ChatMessage, socket: socketIo.Socket): void => {
    console.log("[server](message): %s", JSON.stringify(m));
    let room: string;
    Object.keys(socket.rooms).forEach((roomId) => {
      if (roomId !== socket.id) {
        room = roomId;
      }
    });
    console.log("Room: " + room);

    // Emits the ChatMessage to all connected clients via a MESSAGE event.
    this.io.to(room).emit(SocketEvent.MESSAGE, m);
  };

  /**
   * Listener for registerPlayer event. Adds players to the model and sends back lobby events.
   * @param socketId  the socketId of the client registering a player
   * @param res       the response object, containing the client username
   */
  registerPlayer(socketId: string, payload: RegisterPlayerPayload) {
    if (this.model.getGameProgressState()) {
      this.io.to(socketId).emit(SocketEvent.LL_LOBBY, {
        success: false,
        usernameList: [],
      });
    } else {
      let success: boolean = this.model.addPlayer(socketId, payload.username);
      let players: Player[] = this.model.getPlayers();
      let usernames: string[] = [];
      let socketIds: string[] = [];
      for (let p of players) {
        usernames.push(p.username);
        socketIds.push(p.id);
      }

      let lobby: LobbyPayload = {
        success: success,
        usernameList: usernames,
      };

      for (let id of socketIds) {
        this.io.to(id).emit(SocketEvent.LL_LOBBY, lobby);
      }
    }
  }

  /**
   * Listener for readyPlayer events, also responsible for starting the game and sending first game state.
   * Also responsible for restarting rounds/games.
   */
  readyPlayer(socketId: string, payload: ReadyPlayerPayload) {
    this.model.incrementNumReady();
    let players: Player[] = this.model.getPlayers();

    // For now, game action will be prevented when only one person readys up.
    // This can be transformed into an event to display on the frontend later.
    if (
      this.model.getNumReady() === players.length &&
      this.model.getNumReady() !== 1
    ) {
      if (payload.status === ReadyStatus.GAME_START) {
        this.model.startGame();
        this.sendGameState();
      } else if (payload.status === ReadyStatus.ROUND_START) {
        this.model.resetRound();
        this.model.startGame();
        this.sendGameState();
      } else if (payload.status === ReadyStatus.GAME_RESTART) {
        this.model.resetGame();
        this.model.startGame();
        this.sendGameState();
      }

      this.model.resetNumReady();
    }
  }

  /**
   * Sends the given death message if it is not empty.
   * @param deathMessage  the death message to emit
   */
  private sendDeathMessage(room: string, deathMessage: string) {
    if (deathMessage !== "") {
      this.io.to(room).emit(SocketEvent.MESSAGE, {
        author: "God",
        message: deathMessage,
      });
    }
  }

  /**
   * Listener for selectCard events, alters the model accordingly.
   * @param res the response object of type SelectCardEvent
   */
  selectCard(socketId: string, room: string, payload: SelectCardPayload) {
    let selected: Card = Card.correct(payload.card);
    this.model.selectCard(payload.username, selected);

    // These cards all don't require a Play action, and just progress to the next turn.
    if (
      selected === Card.HANDMAID ||
      selected === Card.COUNTESS ||
      selected === Card.PRINCESS
    ) {
      this.sendDeathMessage(room, this.model.getDeathMessage());

      if (this.model.roundOver()) {
        this.model.gameOver()
          ? this.sendGameOverState()
          : this.sendRoundOverState();
      } else {
        this.model.nextTurn();
        this.sendGameState();
      }
    } else if (
      selected === Card.GUARD ||
      selected === Card.PRIEST ||
      selected === Card.BARON ||
      selected === Card.PRINCE ||
      selected === Card.KING
    ) {
      let players: Player[] = this.model.getPlayers();
      let gameState: GameState[] = this.model.gameState();

      let player: Player = players.find(
        (player) => player.username === payload.username
      );
      let playerIndex: number = players.indexOf(player);
      for (let i = 0; i < gameState.length; i++) {
        if (i !== playerIndex) {
          gameState[i].visiblePlayers = players;
          if (selected === Card.GUARD) {
            gameState[i].watchingGuardPlay = true;
          }
        }
      }

      for (let i: number = 0; i < players.length; i++) {
        this.io.to(players[i].id).emit(SocketEvent.LL_GAME_STATE, gameState[i]);
      }
    } else {
      this.sendGameState();
    }
  }

  /**
   * Listener for playCard events, alters the model accordingly.
   * @param res the response object of type PlayCardEvent
   */
  playCard(socketId: string, room: string, payload: PlayCardPayload) {
    let guess: Card | undefined = payload.guess
      ? Card.correct(payload.guess)
      : undefined;
    this.model.playCard(payload.username, payload.target, guess);

    let lastPlayed: Card = this.model.getLastPlayed();

    if (
      (lastPlayed === Card.PRIEST || lastPlayed === Card.BARON) &&
      payload.target
    ) {
      this.sendGameState();
    } else if (this.model.roundOver()) {
      this.sendDeathMessage(room, this.model.getDeathMessage());
      this.model.gameOver()
        ? this.sendGameOverState()
        : this.sendRoundOverState();
    } else {
      this.sendDeathMessage(room, this.model.getDeathMessage());
      this.model.nextTurn();
      this.sendGameState();
    }
  }

  /**
   * Listener for confirm events
   * @param res the response object
   */
  confirm(socketId: string, room: string, payload: ConfirmPayload) {
    this.model.confirmPlay(payload.username);
    this.sendDeathMessage(room, this.model.getDeathMessage());

    if (this.model.roundOver()) {
      this.model.gameOver()
        ? this.sendGameOverState()
        : this.sendRoundOverState();
    } else {
      this.model.nextTurn();
      this.sendGameState();
    }
  }

  /**
   * Sends each client their respective game state.
   */
  private sendGameState(
    watchingGuardPlay?: boolean,
    guardPlayerUsername?: string
  ): void {
    let players: Player[] = this.model.getPlayers();
    let gameState: GameState[] = this.model.gameState();

    if (watchingGuardPlay && guardPlayerUsername) {
      let player: Player = players.find(
        (player) => player.username === guardPlayerUsername
      );
      let playerIndex: number = players.indexOf(player);
      for (let i = 0; i < gameState.length; i++) {
        if (i !== playerIndex) {
          gameState[i].watchingGuardPlay = true;
        }
      }
    }

    for (let i: number = 0; i < players.length; i++) {
      this.io.to(players[i].id).emit(SocketEvent.LL_GAME_STATE, gameState[i]);
    }
    console.log(this.model.gameState());
  }

  /**
   * Sends each client the model's round over state.
   */
  private sendRoundOverState(): void {
    let players: Player[] = this.model.getPlayers();
    let message: string = this.model.getMessage();

    let roundOver: RoundOverPayload = {
      players: players,
      message: message,
    };

    for (let p of players) {
      this.io.to(p.id).emit(SocketEvent.LL_ROUND_OVER, roundOver);
    }
  }

  /**
   * Sends each client the model's game over state.
   */
  private sendGameOverState(): void {
    let players: Player[] = this.model.getPlayers();
    let message: string = this.model.getMessage();

    let gameOver: GameOverPayload = {
      players: players,
      message: message,
    };

    for (let p of players) {
      this.io.to(p.id).emit(SocketEvent.LL_GAME_OVER, gameOver);
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
      this.io.emit(SocketEvent.MESSAGE, {
        author: disconnected.username,
        message: "has left the game.",
      });

      this.model.removePlayer(socketId);
      this.model.resetGame();

      players = this.model.getPlayers();
      let usernames: string[] = [];
      let socketIds: string[] = [];
      for (let p of players) {
        usernames.push(p.username);
        socketIds.push(p.id);
      }

      let lobby: LobbyPayload = {
        success: true,
        usernameList: usernames,
        reset: true,
      };
      for (let id of socketIds) {
        this.io.to(id).emit(SocketEvent.LL_LOBBY, lobby);
      }
    }

    console.log("Client disconnected");
  }

  /**
   * Communicates the given highlight event to the rest of the game clients
   * @param scoketId the socket id of this player
   * @param res the response object
   */
  highlight(socketId: string, room: string, payload: HighlightPayload): void {
    let players: Player[] = this.model.getPlayers();
    let gameState: GameState[] = this.model.gameState();

    for (let gs of gameState) {
      gs.highlightedPlayer = payload.player;
      gs.highlightedCard = payload.card;
      gs.visiblePlayers = players;
      if (this.model.getLastPlayed() === Card.GUARD) {
        gs.watchingGuardPlay = true;
      }
    }

    for (let i: number = 0; i < players.length; i++) {
      if (players[i].id !== socketId) {
        this.io.to(players[i].id).emit(SocketEvent.LL_GAME_STATE, gameState[i]);
      }
    }
  }
}
