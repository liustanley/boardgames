import React from "react";
import {
  Card,
  Player,
  CodenamesColors,
  Team,
  CardType,
} from "../models/CodenamesTypes";
import { CodenamesCard } from "./CodenamesCard";
import "./CodenamesBoard.css";
import { PlayerStatus } from "../models/CodenamesTypes";
import { SocketService } from "../services/SocketService";

interface CodenamesBoardProps {
  socket: SocketService;
  cards: Card[];
  player?: Player;
  status: PlayerStatus;
}

interface CodenamesBoardState {
  cardGrid: Array<Array<Card>>;
}

export class CodenamesBoard extends React.Component<
  CodenamesBoardProps,
  CodenamesBoardState
> {
  constructor(props: CodenamesBoardProps) {
    super(props);
    this.state = {
      cardGrid: [
        this.props.cards.slice(0, 5),
        this.props.cards.slice(5, 10),
        this.props.cards.slice(10, 15),
        this.props.cards.slice(15, 20),
        this.props.cards.slice(20, 25),
      ],
    };
  }

  getMessage() {
    switch (this.props.status) {
      case PlayerStatus.RED_GUESSING:
        return "It's Red's Turn";
      case PlayerStatus.BLUE_GUESSING:
        return "It's Blue's Turn";
      case PlayerStatus.RED_WON:
        return "Red Team Wins!";
      case PlayerStatus.BLUE_WON:
        return "Blue Team Wins!";
    }
  }

  getCount(team: Team) {
    let count = 0;
    if (team === Team.RED) {
      this.props.cards.forEach((card) => {
        if (card.type === CardType.RED && !card.revealed) {
          count++;
        }
      });
    } else if (team === Team.BLUE) {
      this.props.cards.forEach((card) => {
        if (card.type === CardType.BLUE && !card.revealed) {
          count++;
        }
      });
    }
    return count;
  }

  render() {
    return (
      <div className="codenamesBoardContainer">
        <div className="codenamesMessage">
          <div className="redCount" style={{ color: CodenamesColors.RED }}>
            <b>{this.getCount(Team.RED)}</b>
          </div>
          {this.getMessage()}
          <div className="blueCount" style={{ color: CodenamesColors.BLUE }}>
            <b>{this.getCount(Team.BLUE)}</b>
          </div>
        </div>
        <hr color={CodenamesColors.WHITE} />
        {this.state.cardGrid.map((row) => (
          <div className="codenamesBoardRow">
            {row.map((card) => (
              <CodenamesCard
                socket={this.props.socket}
                card={card}
                spymaster={this.props.player?.spymaster}
                status={this.props.status}
                team={this.props.player?.team}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
