import io from "socket.io-client";
import {
  RegisterPlayerPayload as LL_RegisterPlayerPayload,
  LobbyPayload as LL_LobbyPayload,
  ReadyPlayerPayload,
  GameStatePayload as LL_GameStatePayload,
  SelectCardPayload as LL_SelectCardPayload,
  ConfirmPayload,
  PlayCardPayload,
  RoundOverPayload,
  GameOverPayload,
  HighlightPayload,
} from "../models/LoveLetterTypes";
import {
  CreateGamePayload,
  JoinGamePayload,
  SocketEvent,
  ChatMessagePayload,
} from "../models/GameTypes";
import {
  LobbyPayload as CN_LobbyPayload,
  RegisterPlayerPayload as CN_RegisterPlayerPayload,
  GameStatePayload as CN_GameStatePayload,
  ChooseRolePayload,
  SelectCardPayload as CN_SelectCardPayload,
  StartGamePayload,
  EndTurnPayload,
} from "../models/CodenamesTypes";

/**
 * Represents a service object that manages socket connection to the server.
 */
export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  /**
   * Initializes this class's socket connection.
   */
  init(): SocketService {
    console.log("initiating socket service");
    // this.socket = io("https://tranquil-river-48506.herokuapp.com");
    this.socket = io("localhost:8080");
    return this;
  }

  createGame(payload: CreateGamePayload, callback: Function) {
    console.log("creating game - " + payload.gameType);
    this.socket.emit(SocketEvent.CREATE_GAME, payload, callback);
  }

  joinGame(payload: JoinGamePayload, callback: Function) {
    console.log("joining game - " + payload.gameType + " - " + payload.roomId);
    this.socket.emit(SocketEvent.JOIN_GAME, payload, callback);
  }

  /**
   * Send a message for the server to broadcast.
   */
  sendChatMessage(message: ChatMessagePayload): void {
    console.log("emitting chat message: " + message);
    this.socket.emit(SocketEvent.MESSAGE, message);
  }

  /**
   * Listens for incoming chat messages.
   * @param callback function to call upon receiving a chat message.
   */
  subscribeToChat(callback: (message: ChatMessagePayload) => void) {
    this.socket.on(SocketEvent.MESSAGE, (m: ChatMessagePayload) => callback(m));
  }

  /**
   * Disconnect - used when unmounting
   */
  disconnect(): void {
    this.socket.disconnect();
  }

  LOVE_LETTER = {
    registerPlayer: (payload: LL_RegisterPlayerPayload) => {
      console.log("registering player: " + payload.username);
      this.socket.emit(SocketEvent.LL_REGISTER_PLAYER, payload);
    },

    subscribeToLobby: (callback: (result: LL_LobbyPayload) => void) => {
      this.socket.on(SocketEvent.LL_LOBBY, (result: LL_LobbyPayload) =>
        callback(result)
      );
    },

    readyPlayer: (payload: ReadyPlayerPayload) => {
      console.log("ready player: " + payload.username + " - " + payload.status);
      this.socket.emit(SocketEvent.LL_READY_PLAYER, payload);
    },

    subscribeToGameState: (callback: (result: LL_GameStatePayload) => void) => {
      this.socket.on(SocketEvent.LL_GAME_STATE, (result: LL_GameStatePayload) =>
        callback(result)
      );
    },

    selectCard: (payload: LL_SelectCardPayload) => {
      console.log("selecting card: " + payload.username + " - " + payload.card);
      this.socket.emit(SocketEvent.LL_SELECT_CARD, payload);
    },

    playCard: (payload: PlayCardPayload) => {
      console.log(
        "playing card: " + payload.username + " targeting: " + payload.target
      );
      this.socket.emit(SocketEvent.LL_PLAY_CARD, payload);
    },

    confirm: (payload: ConfirmPayload) => {
      console.log("confirming: " + payload.username);
      this.socket.emit(SocketEvent.LL_CONFIRM, payload);
    },

    highlight: (payload: HighlightPayload) => {
      console.log(
        "highlighting: " +
          payload.username +
          " - " +
          payload.player +
          " - " +
          payload.card
      );
      this.socket.emit(SocketEvent.LL_HIGHLIGHT, payload);
    },

    subscribeToRoundOver: (callback: (result: RoundOverPayload) => void) => {
      this.socket.on(SocketEvent.LL_ROUND_OVER, (result: RoundOverPayload) =>
        callback(result)
      );
    },

    subscribeToGameOver: (callback: (result: GameOverPayload) => void) => {
      this.socket.on(SocketEvent.LL_GAME_OVER, (result: GameOverPayload) =>
        callback(result)
      );
    },
  };

  CODENAMES = {
    registerPlayer: (payload: CN_RegisterPlayerPayload) => {
      console.log("registering player: " + payload.username);
      this.socket.emit(SocketEvent.CN_REGISTER_PLAYER, payload);
    },

    subscribeToLobby: (callback: (result: CN_LobbyPayload) => void) => {
      this.socket.on(SocketEvent.CN_LOBBY, (result: CN_LobbyPayload) =>
        callback(result)
      );
    },

    subscribeToGameState: (callback: (result: CN_GameStatePayload) => void) => {
      this.socket.on(SocketEvent.CN_GAME_STATE, (result: CN_GameStatePayload) =>
        callback(result)
      );
    },

    chooseRole: (payload: ChooseRolePayload) => {
      this.socket.emit(SocketEvent.CN_CHOOSE_ROLE, payload);
    },

    startGame: (payload: StartGamePayload) => {
      this.socket.emit(SocketEvent.CN_START_GAME, payload);
    },

    selectCard: (payload: CN_SelectCardPayload) => {
      this.socket.emit(SocketEvent.CN_SELECT_CARD, payload);
    },

    endTurn: (payload: EndTurnPayload) => {
      this.socket.emit(SocketEvent.CN_END_TURN, payload);
    },
  };
}
