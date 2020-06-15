import React from "react";
import LoveLetterCardComponent from "./LoveLetterCardComponent";
import { LoveLetterColors } from "../models/LoveLetterTypes";
import { Card } from "./Card";

interface LoveLetterCardContainerProps {
  card: Card;
  onSelectCard?: Function;
  selected?: boolean;
  clearSelected?: Function;
  selectable?: boolean;
  cheatSheet?: boolean;
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

  numberToColor(card: Card): LoveLetterColors {
    switch (card) {
      case Card.GUARD:
        return this.state.hovered
          ? LoveLetterColors.ORANGE_DARK
          : LoveLetterColors.ORANGE;
      case Card.PRIEST:
        return this.state.hovered
          ? LoveLetterColors.YELLOW_DARK
          : LoveLetterColors.YELLOW;
      case Card.BARON:
        return this.state.hovered
          ? LoveLetterColors.GREEN_DARK
          : LoveLetterColors.GREEN;
      case Card.HANDMAID:
        return this.state.hovered
          ? LoveLetterColors.TEAL_DARK
          : LoveLetterColors.TEAL;
      case Card.PRINCE:
        return this.state.hovered
          ? LoveLetterColors.BLUE_DARK
          : LoveLetterColors.BLUE;
      case Card.KING:
        return this.state.hovered
          ? LoveLetterColors.VIOLET_DARK
          : LoveLetterColors.VIOLET;
      case Card.COUNTESS:
        return this.state.hovered
          ? LoveLetterColors.PINK_DARK
          : LoveLetterColors.PINK;
      case Card.PRINCESS:
        return this.state.hovered
          ? LoveLetterColors.RED_DARK
          : LoveLetterColors.RED;
      default:
        return LoveLetterColors.WHITE;
    }
  }

  numberToColorDark(card: Card): LoveLetterColors {
    switch (card) {
      case Card.GUARD:
        return this.state.hovered
          ? LoveLetterColors.ORANGE_DARKEST
          : LoveLetterColors.ORANGE_DARK;
      case Card.PRIEST:
        return this.state.hovered
          ? LoveLetterColors.YELLOW_DARKEST
          : LoveLetterColors.YELLOW_DARK;
      case Card.BARON:
        return this.state.hovered
          ? LoveLetterColors.GREEN_DARKEST
          : LoveLetterColors.GREEN_DARK;
      case Card.HANDMAID:
        return this.state.hovered
          ? LoveLetterColors.TEAL_DARKEST
          : LoveLetterColors.TEAL_DARK;
      case Card.PRINCE:
        return this.state.hovered
          ? LoveLetterColors.BLUE_DARKEST
          : LoveLetterColors.BLUE_DARK;
      case Card.KING:
        return this.state.hovered
          ? LoveLetterColors.VIOLET_DARKEST
          : LoveLetterColors.VIOLET_DARK;
      case Card.COUNTESS:
        return this.state.hovered
          ? LoveLetterColors.PINK_DARKEST
          : LoveLetterColors.PINK_DARK;
      case Card.PRINCESS:
        return this.state.hovered
          ? LoveLetterColors.RED_DARKEST
          : LoveLetterColors.RED_DARK;
      default:
        return LoveLetterColors.WHITE;
    }
  }

  numberToName(card: LoveLetterCardContainerProps["card"]): string {
    return card.toString();
  }

  onClick() {
    if (this.props.clearSelected && this.props.onSelectCard) {
      this.props.clearSelected();
      this.props.onSelectCard(this.props.card);
    }
  }

  onMouseEnter() {
    if (this.props.onSelectCard) {
      this.setState({ hovered: true });
    }
  }

  onMouseLeave() {
    if (this.props.onSelectCard) {
      this.setState({ hovered: false });
    }
  }

  render() {
    return (
      <LoveLetterCardComponent
        card={this.props.card}
        numberToColor={this.numberToColor.bind(this)}
        numberToName={this.numberToName.bind(this)}
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        selected={this.props.selected}
        numberToColorDark={this.numberToColorDark.bind(this)}
        selectable={this.props.selectable}
        cheatSheet={this.props.cheatSheet}
      />
    );
  }
}
