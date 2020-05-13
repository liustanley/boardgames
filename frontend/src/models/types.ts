/**
 * The message object to be used by Socket.io events.
 */
export interface ChatMessage {
  author: string;
  message: string;
}

export interface registerPlayerEvent {
  username: string;
}

export interface lobbyEvent {
  success: boolean;
  usernameList: string[];
}

export interface readyPlayerEvent {
  username: string;
}

export interface playCardEvent {
  username: string;
  card: number;
}

export interface gameStateEvent {
  message: string;
  visibleCards: Card[];
  discardCards: Card[];
  visiblePlayers?: Player[];
  status: PlayerStatus;
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

interface Player {
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

interface Card {
  value: number;
  key: string; // name
  description: string;
}

/**
 * Defines the structure of the live chat state.
 * - input is updated as the user is typing the message to be submitted
 * - messages[] is an array of ChatMessages received from Socket.io emits
 */
export interface ChatState {
  username: string;
  input: string;
  messages: ChatMessage[];
  userColors: Array<String>;
  userToColorMap: Map<String, String>;
}
