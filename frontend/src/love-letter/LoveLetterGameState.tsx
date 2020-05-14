import React, { Fragment } from "react";
import { GameStateEvent, PlayerStatus, Card } from "../models/types";
import { SocketService } from "../services/SocketService";
import { LoveLetterColors } from "../models/constants";
import "./LoveLetterGameState.css";
import { LoveLetterCardContainer } from "./LoveLetterCardContainer";
import { LoveLetterDeckCard } from "./LoveLetterDeckCard";
import { ChatContainer } from "../chat/ChatContainer";
import { Card as CardEnum } from "../../../backend/src/love-letter/Card";

export interface LoveLetterGameStateProps {
  socket: SocketService;
  username: string;
  gameState: GameStateEvent;
}

export interface LoveLetterGameStateState {
  leftSelected: boolean;
  rightSelected: boolean;
  cardSelected?: number;
}

export class LoveLetterGameState extends React.Component<
  LoveLetterGameStateProps,
  LoveLetterGameStateState
> {
  constructor(props: LoveLetterGameStateProps) {
    super(props);
    this.state = {
      leftSelected: false,
      rightSelected: false,
      cardSelected: undefined,
    };
  }

  onSelectCard(value: number) {
    this.setState({ cardSelected: value });
  }

  clearLeftCard() {
    this.setState({ leftSelected: false, rightSelected: true });
  }

  clearRightCard() {
    this.setState({ rightSelected: false, leftSelected: true });
  }

  onPlayCard() {
    if (this.state.cardSelected) {
      const card = this.numberToCard(this.state.cardSelected);
      this.props.socket.playCard({
        username: this.props.username,
        card: card,
      });
      this.setState({
        cardSelected: undefined,
        leftSelected: false,
        rightSelected: false,
      });
    }
  }

  numberToCard(value: number): Card {
    switch (value) {
      case 1:
        return Card.GUARD;
      case 2:
        return Card.PRIEST;
      case 3:
        return Card.BARON;
      case 4:
        return Card.HANDMAID;
      case 5:
        return Card.PRINCE;
      case 6:
        return Card.KING;
      case 7:
        return Card.COUNTESS;
      case 8:
        return Card.PRINCESS;
      default:
        return Card.GUARD;
    }
  }

  render() {
    return (
      <Fragment>
        <div className="loveLetterGameState">
          <div className="deck">
            {this.props.gameState.discardCards.map((card, index) => (
              <LoveLetterDeckCard number={card.value} index={index} />
            ))}
          </div>
          <hr color={LoveLetterColors.WHITE}></hr>
          <div className="gameMessage">
            <b>{this.props.gameState.message}</b>
          </div>
          <hr color={LoveLetterColors.WHITE}></hr>
          {(this.props.gameState.status === PlayerStatus.WAITING ||
            this.props.gameState.status === PlayerStatus.VIEWING_CARD) && (
            <div className="cardContainer">
              <div className="card">
                <LoveLetterCardContainer
                  number={this.props.gameState.visibleCards[0].value}
                />
              </div>
            </div>
          )}
          {this.props.gameState.status === PlayerStatus.SELECTING_CARD && (
            <div className="cardContainer">
              <div className="card">
                <LoveLetterCardContainer
                  number={this.props.gameState.visibleCards[0].value}
                  onSelectCard={this.onSelectCard.bind(this)}
                  selected={this.state.leftSelected}
                  clearSelected={this.clearRightCard.bind(this)}
                />
              </div>
              <div className="card">
                <LoveLetterCardContainer
                  number={this.props.gameState.visibleCards[1].value}
                  onSelectCard={this.onSelectCard.bind(this)}
                  selected={this.state.rightSelected}
                  clearSelected={this.clearLeftCard.bind(this)}
                />
              </div>
            </div>
          )}
          {this.props.gameState.status === PlayerStatus.COMPARING_CARDS && (
            <div className="cardContainer">
              <div className="card">
                <LoveLetterCardContainer
                  number={this.props.gameState.visibleCards[0].value}
                />
              </div>
              <div className="card">
                <LoveLetterCardContainer
                  number={this.props.gameState.visibleCards[1].value}
                />
              </div>
            </div>
          )}
        </div>
        {this.props.gameState.status === PlayerStatus.SELECTING_CARD && (
          <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
            <b>{this.state.cardSelected ? "Play Card" : "Select a Card"}</b>
          </div>
        )}
        {(this.props.gameState.status === PlayerStatus.VIEWING_CARD ||
          this.props.gameState.status === PlayerStatus.COMPARING_CARDS) && (
          <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
            <b>{this.state.cardSelected ? "Play Card" : "Select a Card"}</b>
          </div>
        )}
      </Fragment>
    );
  }
}
