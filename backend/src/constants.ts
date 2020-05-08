/**
 * Event types emitted by Socket.io.
 * Connect and disconnect events fire when clients connect and disconnect from the server.
 * Message event handles incoming chat messages.
 */
export enum ChatEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message'
}