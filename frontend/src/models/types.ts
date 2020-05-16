import { Card } from "../love-letter/Card";

/**
 * The message object to be used by Socket.io events.
 */
// Sent by front-end and back-end
export interface ChatMessageEvent {
  author: string;
  message: string;
}

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

export interface Player {
  id: string; // socket id
  username: string; // user input username
  tokens?: number;
  card?: Card;
  drawCard?: Card;
  visibleCards?: Card[];
  immune?: boolean;
  status?: PlayerStatus;
  selfSelectable?: boolean;
}

/**
 * Defines the structure of the live chat state.
 * - input is updated as the user is typing the message to be submitted
 * - messages[] is an array of ChatMessages received from Socket.io emits
 */
export interface ChatState {
  username: string;
  input: string;
  messages: ChatMessageEvent[];
  userColors: Array<String>;
  userToColorMap: Map<String, String>;
}
