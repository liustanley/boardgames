export enum CodenamesColors {
  WHITE = "#ECEFF4",
  RED = "#BF616A",
  RED_DARK = "#8c454c",
  BLUE = "#5e81ac",
  BLUE_DARK = "#455f80",
  GREEN = "#A3BE8C",
  GREEN_DARK = "#788c66",
  VIOLET = "#9D6295",
  VIOLET_DARK = "#75486f",
  BLACK = "#000000",
  YELLOW = "#D7AF70",
}

export interface Player {
  username: string;
  team: Team;
  spymaster: boolean;
}

export enum Team {
  BLUE = "BLUE",
  RED = "RED",
  NONE = "NONE",
}

// Sent by front-end
export interface RegisterPlayerPayload {
  username: string;
}

// Sent by back-end
export interface LobbyEvent {
  unassigned: string[];
  blueTeam: string[];
  redTeam: string[];
}

// Sent by front-end
export interface ChooseRolePayload {
  username: string;
  team: Team;
  spymaster: boolean;
}

// Sent by front-end
export interface StartGamePayload {}

// Sent by back-end
export interface GameStatePayload {
  playerList: Player[];
  cards: Card[];
  status: PlayerStatus;
}

// Sent by front-end
export interface SelectCardPayload {
  team: Team;
  word: string;
}

// Sent by front-end
export interface EndTurnPayload {
  team: Team;
}

export interface Card {
  word: string;
  type: CardType;
  revealed: boolean;
}

export enum CardType {
  RED = "RED",
  BLUE = "BLUE",
  NEUTRAL = "NEUTRAL",
  DEATH = "DEATH",
}

export enum PlayerStatus {
  RED_GUESSING = "RED_GUESSING",
  BLUE_GUESSING = "BLUE_GUESSING",
  RED_WON = "RED_WON",
  BLUE_WON = "BLUE_WON",
}

// TODO
const organ = { word: "organ", type: CardType.RED, revealed: true };
const czech = { word: "czech", type: CardType.NEUTRAL, revealed: false };
const telescope = { word: "telescope", type: CardType.BLUE, revealed: true };
const bolt = { word: "bolt", type: CardType.BLUE, revealed: true };
const china = { word: "china", type: CardType.NEUTRAL, revealed: true };

const antarctica = { word: "antarctica", type: CardType.RED, revealed: false };
const chick = { word: "chick", type: CardType.RED, revealed: false };
const shop = { word: "shop", type: CardType.NEUTRAL, revealed: false };
const ninja = { word: "ninja", type: CardType.BLUE, revealed: false };
const theater = { word: "theater", type: CardType.RED, revealed: true };

const sound = { word: "sound", type: CardType.BLUE, revealed: false };
const port = { word: "port", type: CardType.RED, revealed: true };
const helicopter = { word: "helicopter", type: CardType.BLUE, revealed: true };
const mount = { word: "mount", type: CardType.BLUE, revealed: false };
const car = { word: "car", type: CardType.DEATH, revealed: true };

const ambulance = {
  word: "ambulance",
  type: CardType.NEUTRAL,
  revealed: false,
};
const pie = { word: "pie", type: CardType.RED, revealed: false };
const staff = { word: "staff", type: CardType.NEUTRAL, revealed: true };
const bond = { word: "bond", type: CardType.NEUTRAL, revealed: true };
const spell = { word: "spell", type: CardType.RED, revealed: false };

const cricket = { word: "cricket", type: CardType.RED, revealed: true };
const mug = { word: "mug", type: CardType.BLUE, revealed: false };
const undertaker = {
  word: "undertaker",
  type: CardType.NEUTRAL,
  revealed: false,
};
const scorpion = { word: "scorpion", type: CardType.BLUE, revealed: true };
const grass = { word: "grass", type: CardType.BLUE, revealed: false };

export const testCards = [
  organ,
  czech,
  telescope,
  bolt,
  china,
  antarctica,
  chick,
  shop,
  ninja,
  theater,
  sound,
  port,
  helicopter,
  mount,
  car,
  ambulance,
  pie,
  staff,
  bond,
  spell,
  cricket,
  mug,
  undertaker,
  scorpion,
  grass,
];
