import { Player } from "./Player";
import { Card } from "./Card";

// Sent by front-end
export interface RegisterPlayerEvent {
  username: string;
}

// Sent by back-end
export interface LobbyEvent {
  success: boolean;
  usernameList: string[];
}

// Sent by front-end
export interface ReadyPlayerEvent {
  username: string;
}

// Sent by front-end
export interface PlayCardEvent {
  username: string;
  card: Card;
}

// Sent by front-end
export interface ConfirmEvent {
  username: string;
}

// Sent by front-end
export interface SelectPlayerEvent {
  username: string;
  player: Player;
}

// Sent by front-end
export interface GuessCardEvent {
  username: string;
  player: Player;
  card: Card;
}

// Sent by back-end
export interface GameStateEvent {
  message: string;
  visibleCards: Card[];
  discardCards: Card[];
  visiblePlayers?: Player[];
  status: PlayerStatus;
}

// Sent by back-end
export interface RoundOverEvent {
  message: string;
  players: Player[];
}

export enum PlayerStatus {
  WAITING = "WAITING",
  SELECTING_CARD = "SELECTING_CARD",
  GUESSING_CARD = "GUESSING_CARD",
  VIEWING_CARD = "VIEWING_CARD",
  COMPARING_CARDS = "COMPARING_CARDS",
  SELECTING_PLAYER = "SELECTING_PLAYER",
  DEAD = "DEAD",
}

export interface GameState {
  message: string;
  visibleCards: Card[];
  discardCards: Card[];
  visiblePlayers?: Player[];
  status: PlayerStatus;
}
