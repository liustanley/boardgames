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
