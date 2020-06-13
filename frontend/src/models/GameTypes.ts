export enum Games {
  LOVE_LETTER = "loveletter",
  CODENAMES = "codenames",
}

// Sent by frontend
export interface CreateGameEvent {
  gameType: Games;
}

// Sent by backend
export interface CreateGameResponseEvent {
  roomId: string;
}

// Sent by frontend
export interface JoinGameEvent {
  gameType: Games;
  roomId: string;
}

// Sent by backend
export interface JoinGameResponseEvent {
  success: boolean;
}

export enum SocketEvent {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  MESSAGE = "message",
  JOIN_GAME = "JOIN_GAME",
  CREATE_GAME = "CREATE_GAME",
  LL_REGISTER_PLAYER = "LL_REGISTER_PLAYER",
  LL_LOBBY = "LL_LOBBY",
  LL_READY_PLAYER = "LL_READY_PLAYER",
  LL_SELECT_CARD = "LL_SELECT_CARD",
  LL_PLAY_CARD = "LL_PLAY_CARD",
  LL_CONFIRM = "LL_CONFIRM",
  LL_GAME_STATE = "LL_GAME_STATE",
  LL_HIGHLIGHT = "LL_HIGHLIGHT",
  LL_ROUND_OVER = "LL_ROUND_OVER",
  LL_GAME_OVER = "LL_GAME_OVER",
}
