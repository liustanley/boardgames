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
  reset?: boolean;
}

// Sent by front-end
export interface ReadyPlayerEvent {
  username: string;
  status: ReadyStatus;
}

export enum ReadyStatus {
  GAME_START = "GAME_START",
  ROUND_START = "ROUND_START",
  GAME_RESTART = "GAME_RESTART",
}

// Sent by front-end
export interface SelectCardEvent {
  username: string;
  card: Card;
}

// Sent by front-end
export interface PlayCardEvent {
  username: string;
  target?: string;
  guess?: Card;
}

// Sent by front-end after Baron/Priest play
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
  highlightedPlayer?: Player;
  highlightedCard?: Card;
  watchingGuardPlay?: boolean;
}

// Sent by front-end
export interface HighlightEvent {
  username: string; // player doing the selecting
  player?: Player; // highlighted player
  card?: Card; // highlighted card
}

// Sent by back-end
export interface RoundOverEvent {
  message: string;
  players: Player[];
}

// Sent by back-end
export interface GameOverEvent {
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
  WATCHING = "WATCHING",
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

/**
 * Colors used in Love Letter
 */
export enum LoveLetterColors {
  RED = "#BF616A",
  RED_DARK = "#8c454c",
  RED_DARKEST = "#5e2e33",
  ORANGE = "#D08770",
  ORANGE_DARK = "#ab6d5b",
  ORANGE_DARKEST = "#805244",
  YELLOW = "#EBCB8B",
  YELLOW_DARK = "#b39a68",
  YELLOW_DARKEST = "#8a7650",
  GREEN = "#A3BE8C",
  GREEN_DARK = "#788c66",
  GREEN_DARKEST = "#556349",
  TEAL = "#87C1D1",
  TEAL_DARK = "#6794a1",
  TEAL_DARKEST = "#4d707a",
  BLUE = "#9B91D8",
  BLUE_DARK = "#766fa6",
  BLUE_DARKEST = "#56517a",
  VIOLET = "#BF89B9",
  VIOLET_DARK = "#8f658a",
  VIOLET_DARKEST = "#634660",
  PINK = "#EA85A8",
  PINK_DARK = "#ad617c",
  PINK_DARKEST = "#82495d",
  WHITE = "#ECEFF4",
  BACKGROUND_LIGHT = "#434c5e",
  BACKGROUND_DARK = "#3B4252",
  BACKGROUND_BLUE = "#5e81ac",
  BACKGROUND_BLACK = "#2e3440",
}

export const cardGuessList = [
  Card.PRIEST,
  Card.BARON,
  Card.HANDMAID,
  Card.PRINCE,
  Card.KING,
  Card.COUNTESS,
  Card.PRINCESS,
];
