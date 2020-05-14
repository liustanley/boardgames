export class Card {
  static readonly GUARD = new Card("GUARD", 1, "Guess another player's card");
  static readonly PRIEST = new Card(
    "PRIEST",
    2,
    "Look at another player's card"
  );
  static readonly BARON = new Card(
    "BARON",
    3,
    "Compare cards with another player"
  );
  static readonly HANDMAID = new Card(
    "HANDMAID",
    4,
    "Make yourself immune for one turn"
  );
  static readonly PRINCE = new Card(
    "PRINCE",
    5,
    "Make a player discard their card"
  );
  static readonly KING = new Card("KING", 6, "Trade cards with another player");
  static readonly COUNTESS = new Card(
    "COUNTESS",
    7,
    "Discard if you have a Prince or King"
  );
  static readonly PRINCESS = new Card(
    "PRINCESS",
    8,
    "Lose if you discard this"
  );

  // private to disallow creating other instances of this type
  private constructor(
    private readonly key: string,
    public readonly value: number,
    public readonly description: string
  ) {}

  toString() {
    return this.key;
  }
}

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

// Sent by back-end
export interface GameStateEvent {
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
