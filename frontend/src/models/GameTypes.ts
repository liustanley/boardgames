export enum Games {
  LOVE_LETTER = "loveletter",
  CODENAMES = "codenames",
}

export interface ChatMessagePayload {
  author: string;
  message: string;
}

// Sent by frontend
export interface CreateGamePayload {
  gameType: Games;
}

// Sent by backend
export interface CreateGameResponsePayload {
  roomId: string;
}

// Sent by frontend
export interface JoinGamePayload {
  gameType: Games;
  roomId: string;
}

// Sent by backend
export interface JoinGameResponsePayload {
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
  CN_REGISTER_PLAYER = "CN_REGISTER_PLAYER",
  CN_LOBBY = "CN_LOBBY",
  CN_CHOOSE_ROLE = "CN_CHOOSE_ROLE",
  CN_START_GAME = "CN_START_GAME",
  CN_GAME_STATE = "CN_GAME_STATE",
  CN_SELECT_CARD = "CN_SELECT_CARD",
  CN_END_TURN = "CN_END_TURN",
}
