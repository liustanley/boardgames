import React from "react";
import {
  Card,
  Team,
  CardType,
  CodenamesColors,
  PlayerStatus,
} from "../models/CodenamesTypes";
import "./CodenamesCard.css";
import { SocketService } from "../services/SocketService";

interface CodenamesCardProps {
  socket: SocketService;
  card: Card;
  spymaster?: boolean;
  status: PlayerStatus;
  team?: Team;
}

interface CodenamesCardState {
  hovered: boolean;
  myTurn: boolean;
}

export class CodenamesCard extends React.Component<
  CodenamesCardProps,
  CodenamesCardState
> {
  constructor(props: CodenamesCardProps) {
    super(props);
    this.state = {
      hovered: false,
      myTurn:
        (this.props.status === PlayerStatus.RED_GUESSING &&
          this.props.team === Team.RED) ||
        (this.props.status === PlayerStatus.BLUE_GUESSING &&
          this.props.team === Team.BLUE),
    };
  }
  getBackgroundColor() {
    if (!this.props.spymaster) {
      if (this.props.card.revealed) {
        return this.typeToColor(this.props.card.type);
      } else if (this.state.hovered && this.state.myTurn) {
        return CodenamesColors.VIOLET;
      } else {
        return CodenamesColors.WHITE;
      }
    } else {
      if (!this.props.card.revealed) {
        return CodenamesColors.WHITE;
      } else {
        return this.typeToColor(this.props.card.type);
      }
    }
  }

  getWordColor() {
    if (!this.props.spymaster) {
      if (this.props.card.revealed) {
        return CodenamesColors.WHITE;
      } else {
        return CodenamesColors.BLACK;
      }
    } else {
      if (!this.props.card.revealed) {
        return this.typeToColor(this.props.card.type);
      } else {
        return CodenamesColors.WHITE;
      }
    }
  }

  typeToColor(cardType: CardType) {
    switch (cardType) {
      case CardType.RED:
        return CodenamesColors.RED;
      case CardType.BLUE:
        return CodenamesColors.BLUE;
      case CardType.NEUTRAL:
        return CodenamesColors.YELLOW;
      case CardType.DEATH:
        return CodenamesColors.BLACK;
    }
  }

  getCursor(): string {
    const myTurn =
      (this.props.status === PlayerStatus.RED_GUESSING &&
        this.props.team === Team.RED) ||
      (this.props.status === PlayerStatus.BLUE_GUESSING &&
        this.props.team === Team.BLUE);

    if (this.props.card.revealed || this.props.spymaster || !myTurn) {
      return "";
    } else {
      return "pointer";
    }
  }

  cardClicked() {
    if (this.state.myTurn) {
      this.props.socket.CODENAMES.selectCard({ word: this.props.card.word });
    }
  }

  render() {
    return (
      <div
        className="codenamesCardContainer"
        style={{
          backgroundColor: this.getBackgroundColor(),
          color: this.getWordColor(),
          cursor: this.getCursor(),
        }}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        onClick={this.cardClicked.bind(this)}
      >
        <div className="codenamesCardWord">{this.props.card.word}</div>
      </div>
    );
  }
}
