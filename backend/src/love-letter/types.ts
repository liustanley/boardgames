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
export interface SelectCardEvent {
  username: string;
  card: Card;
}

// Sent by front-end
export interface PlayCardEvent {
  username: string;
  target?: string; // If target is undefined, then there are no selectable players and the game will progress to the next turn.
  guess?: Card;
}

// Sent by front-end
// Sent after the play of a Baron or a Priest
export interface ConfirmEvent {
  username: string;
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
