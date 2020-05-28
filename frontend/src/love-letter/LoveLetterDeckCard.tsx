import React from "react";
import "./LoveLetterDeckCard.css";
import { LoveLetterColors } from "../models/LoveLetterTypes";

interface LoveLetterDeckCardProps {
  number: number;
  index: number;
}

interface LoveLetterDeckCardState {}

export class LoveLetterDeckCard extends React.Component<
  LoveLetterDeckCardProps,
  LoveLetterDeckCardState
> {
  numberToColor(num: number): LoveLetterColors {
    switch (num) {
      case 1:
        return LoveLetterColors.ORANGE;
      case 2:
        return LoveLetterColors.YELLOW;
      case 3:
        return LoveLetterColors.GREEN;
      case 4:
        return LoveLetterColors.TEAL;
      case 5:
        return LoveLetterColors.BLUE;
      case 6:
        return LoveLetterColors.VIOLET;
      case 7:
        return LoveLetterColors.PINK;
      case 8:
        return LoveLetterColors.RED;
      default:
        return LoveLetterColors.WHITE;
    }
  }
  render() {
    return (
      <div
        className="deckCard"
        style={{
          background: this.numberToColor(this.props.number),
          margin: `12px ${47 * this.props.index}px`,
        }}
      >
        <b>{this.props.number}</b>
      </div>
    );
  }
}
