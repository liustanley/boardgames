import React from "react";
import LoveLetterCardComponent from "./LoveLetterCardComponent";
import { LoveLetterColors } from "../models/constants";

interface LoveLetterCardContainerProps {
  number: number;
  onSelectCard: Function;
  selected: boolean;
  clearSelected: Function;
}

interface LoveLetterCardContainerState {
  hovered: boolean;
}

export class LoveLetterCardContainer extends React.Component<
  LoveLetterCardContainerProps,
  LoveLetterCardContainerState
> {
  constructor(props: LoveLetterCardContainerProps) {
    super(props);
    this.state = {
      hovered: false,
    };
  }
  numberToColor(num: LoveLetterCardContainerProps["number"]): LoveLetterColors {
    switch (num) {
      case 1:
        return this.state.hovered
          ? LoveLetterColors.ORANGE_DARK
          : LoveLetterColors.ORANGE;
      case 2:
        return this.state.hovered
          ? LoveLetterColors.YELLOW_DARK
          : LoveLetterColors.YELLOW;
      case 3:
        return this.state.hovered
          ? LoveLetterColors.GREEN_DARK
          : LoveLetterColors.GREEN;
      case 4:
        return this.state.hovered
          ? LoveLetterColors.TEAL_DARK
          : LoveLetterColors.TEAL;
      case 5:
        return this.state.hovered
          ? LoveLetterColors.BLUE_DARK
          : LoveLetterColors.BLUE;
      case 6:
        return this.state.hovered
          ? LoveLetterColors.VIOLET_DARK
          : LoveLetterColors.VIOLET;
      case 7:
        return this.state.hovered
          ? LoveLetterColors.PINK_DARK
          : LoveLetterColors.PINK;
      case 8:
        return this.state.hovered
          ? LoveLetterColors.RED_DARK
          : LoveLetterColors.RED;
      default:
        return this.state.hovered
          ? LoveLetterColors.ORANGE_DARK
          : LoveLetterColors.ORANGE;
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

  onClick() {
    this.props.clearSelected();
    this.props.onSelectCard(this.props.number);
  }

  onMouseEnter() {
    this.setState({ hovered: true });
  }

  onMouseLeave() {
    this.setState({ hovered: false });
  }

  render() {
    return (
      <LoveLetterCardComponent
        number={this.props.number}
        numberToColor={this.numberToColor.bind(this)}
        numberToName={this.numberToName.bind(this)}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        selected={this.props.selected}
      />
    );
  }
}
