import React from "react";
import { LoveLetterCardContainerProps } from "../models/types";
import LoveLetterCardComponent from "./LoveLetterCardComponent";
import { LoveLetterColors } from "../models/constants";

export class LoveLetterCardContainer extends React.Component<
  LoveLetterCardContainerProps
> {
  numberToColor(num: LoveLetterCardContainerProps["number"]): LoveLetterColors {
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

  numberToName(num: LoveLetterCardContainerProps["number"]): string {
    switch (num) {
      case 1:
        return "GUARD";
      case 2:
        return "PRIEST";
      case 3:
        return "BARON";
      case 4:
        return "HANDMAID";
      case 5:
        return "PRINCE";
      case 6:
        return "KING";
      case 7:
        return "COUNTESS";
      case 8:
        return "PRINCESS";
      default:
        return "UNKNOWN";
    }
  }

  render() {
    return (
      <LoveLetterCardComponent
        number={this.props.number}
        numberToColor={this.numberToColor.bind(this)}
        numberToName={this.numberToName.bind(this)}
      />
    );
  }
}
