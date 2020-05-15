import { Card } from "../love-letter/Card";

/**
 * Colors used in Love Letter
 */
export enum LoveLetterColors {
  RED = "#BF616A",
  RED_DARK = "#8c454c",
  ORANGE = "#D08770",
  ORANGE_DARK = "#ab6d5b",
  YELLOW = "#EBCB8B",
  YELLOW_DARK = "#b39a68",
  GREEN = "#A3BE8C",
  GREEN_DARK = "#788c66",
  TEAL = "#87C1D1",
  TEAL_DARK = "#6794a1",
  BLUE = "#9B91D8",
  BLUE_DARK = "#766fa6",
  VIOLET = "#BF89B9",
  VIOLET_DARK = "#8f658a",
  PINK = "#EA85A8",
  PINK_DARK = "#ad617c",
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
