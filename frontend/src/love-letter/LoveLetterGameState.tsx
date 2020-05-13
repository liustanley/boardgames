import React, { Fragment } from "react";
import { gameStateEvent, PlayerStatus } from "../models/types";
import { SocketService } from "../services/SocketService";
import { LoveLetterColors } from "../models/constants";
import "./LoveLetterGameState.css";
import { LoveLetterCardContainer } from "./LoveLetterCardContainer";

export interface LoveLetterGameStateProps {
  socket: SocketService;
  username: string;
  gameState: gameStateEvent;
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
      this.props.socket.playCard({
        username: this.props.username,
        card: this.state.cardSelected,
      });
    }
  }

  render() {
    return (
      <Fragment>
        <div className="loveLetterGameState">
          <hr color={LoveLetterColors.WHITE}></hr>
          <div className="gameMessage">
            <b>{this.props.gameState.message}</b>
          </div>
          <hr color={LoveLetterColors.WHITE}></hr>
          {this.props.gameState.status === PlayerStatus.SELECTING_CARD && (
            <div className="cardSelection">
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
        </div>
        {this.props.gameState.status === PlayerStatus.SELECTING_CARD && (
          <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
            <b>{this.state.cardSelected ? "Play Card" : "Select a Card"}</b>
          </div>
        )}
      </Fragment>
    );
  }
}
