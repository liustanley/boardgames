import React, { Fragment } from "react";
import { GameStateEvent, PlayerStatus } from "../models/types";
import { SocketService } from "../services/SocketService";
import { LoveLetterColors } from "../models/constants";
import "./LoveLetterGameState.css";
import { LoveLetterCardContainer } from "./LoveLetterCardContainer";
import { LoveLetterDeckCard } from "./LoveLetterDeckCard";
import { Card } from "./Card";

export interface LoveLetterGameStateProps {
  socket: SocketService;
  username: string;
  gameState: GameStateEvent;
}

export interface LoveLetterGameStateState {
  actionCompleted: boolean;
  leftSelected: boolean;
  rightSelected: boolean;
  cardSelected?: Card;
}

export class LoveLetterGameState extends React.Component<
  LoveLetterGameStateProps,
  LoveLetterGameStateState
> {
  constructor(props: LoveLetterGameStateProps) {
    super(props);
    this.state = {
      actionCompleted: false,
      leftSelected: false,
      rightSelected: false,
      cardSelected: undefined,
    };
  }

  onSelectCard(value: Card) {
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
      this.props.socket.playCard({
        username: this.props.username,
        card: this.state.cardSelected,
      });
      this.setState({
        actionCompleted: true,
        cardSelected: undefined,
        leftSelected: false,
        rightSelected: false,
      });
    }
  }

  onConfirm() {
    this.props.socket.confirm({ username: this.props.username });
    this.setState({ actionCompleted: true });
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
              {this.props.gameState.visibleCards.map((card) => (
                <div className="card">
                  <LoveLetterCardContainer card={card} />
                </div>
              ))}
            </div>
          )}
          {this.props.gameState.status === PlayerStatus.SELECTING_CARD && (
            <div className="cardContainer">
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[0]}
                  onSelectCard={this.onSelectCard.bind(this)}
                  selected={this.state.leftSelected}
                  clearSelected={this.clearRightCard.bind(this)}
                />
              </div>
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[1]}
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
                  card={this.props.gameState.visibleCards[0]}
                />
              </div>
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[1]}
                />
              </div>
            </div>
          )}
        </div>
        {this.props.gameState.status === PlayerStatus.SELECTING_CARD &&
          !this.state.actionCompleted && (
            <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
              <b>{this.state.cardSelected ? "Play Card" : "Select a Card"}</b>
            </div>
          )}
        {(this.props.gameState.status === PlayerStatus.VIEWING_CARD ||
          this.props.gameState.status === PlayerStatus.COMPARING_CARDS) &&
          !this.state.actionCompleted && (
            <div className="readyButton" onClick={this.onConfirm.bind(this)}>
              <b>OK</b>
            </div>
          )}
      </Fragment>
    );
  }
}
