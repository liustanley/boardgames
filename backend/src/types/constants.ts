/**
 * Event types emitted by Socket.io.
 * Connect and disconnect events fire when clients connect and disconnect from the server.
 * Message event handles incoming chat messages.
 */
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
