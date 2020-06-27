import React from "react";
import { SocketService } from "../services/SocketService";
import {
  GameStatePayload,
  CodenamesColors,
  Team,
  Player,
  PlayerStatus,
} from "../models/CodenamesTypes";
import "./CodenamesGameState.css";
import { ChatContainer } from "../chat/ChatContainer";
import { CodenamesBoard } from "./CodenamesBoard";

interface CodenamesGameStateProps {
  socket: SocketService;
  username: string;
  gameState: GameStatePayload;
}

interface CodenamesGameStateState {
  player?: Player;
  endTurnHovered: boolean;
}

export class CodenamesGameState extends React.Component<
  CodenamesGameStateProps,
  CodenamesGameStateState
> {
  constructor(props: CodenamesGameStateProps) {
    super(props);
    const player = this.props.gameState.playerList.find(
      (player) => player.username === this.props.username
    );
    this.state = {
      player: player,
      endTurnHovered: false,
    };
  }

  onClickEndTurn() {
    this.props.socket.CODENAMES.endTurn({});
  }

  render() {
    return (
      <div className="codenamesGameStateContainer">
        <div className="codenamesTeamList">
          <div className="redTeam">
            {this.props.gameState.playerList.map(
              (player) =>
                player.team === Team.RED &&
                player.spymaster && (
                  <div style={{ color: CodenamesColors.RED }}>
                    {player.username}
                  </div>
                )
            )}
            <hr
              style={{
                border: "none",
                borderRadius: 5,
                background: CodenamesColors.RED,
                height: 10,
              }}
            />
            {this.props.gameState.playerList.map(
              (player) =>
                player.team === Team.RED &&
                !player.spymaster && (
                  <div style={{ color: CodenamesColors.RED }}>
                    {player.username}
                  </div>
                )
            )}
          </div>
          <div className="blueTeam">
            {this.props.gameState.playerList.map(
              (player) =>
                player.team === Team.BLUE &&
                player.spymaster && (
                  <div style={{ color: CodenamesColors.BLUE }}>
                    {player.username}
                  </div>
                )
            )}
            <hr
              style={{
                border: "none",
                borderRadius: 5,
                background: CodenamesColors.BLUE,
                height: 10,
              }}
            />
            {this.props.gameState.playerList.map(
              (player) =>
                player.team === Team.BLUE &&
                !player.spymaster && (
                  <div style={{ color: CodenamesColors.BLUE }}>
                    {player.username}
                  </div>
                )
            )}
          </div>
        </div>
        <div className="codenamesBoard">
          <CodenamesBoard
            socket={this.props.socket}
            cards={this.props.gameState.cards}
            player={this.state.player}
            status={this.props.gameState.status}
          />
        </div>
        <div className="codenamesChat">
          <ChatContainer
            socket={this.props.socket}
            username={this.props.username}
            size="small"
          />
        </div>
        {(this.props.gameState.status === PlayerStatus.BLUE_GUESSING ||
          this.props.gameState.status === PlayerStatus.RED_GUESSING) && (
          <div
            className="codenamesEndTurnButton"
            style={{
              background: this.state.endTurnHovered
                ? CodenamesColors.VIOLET_DARK
                : CodenamesColors.VIOLET,
              cursor: "pointer",
            }}
            onMouseEnter={() => this.setState({ endTurnHovered: true })}
            onMouseLeave={() => this.setState({ endTurnHovered: false })}
            onClick={this.onClickEndTurn.bind(this)}
          >
            <b>End Turn</b>
          </div>
        )}
      </div>
    );
  }
}
