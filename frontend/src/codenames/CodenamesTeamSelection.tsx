import React, { Fragment } from "react";
import { SocketService } from "../services/SocketService";
import {
  Player,
  CodenamesColors,
  Team,
  GameStateEvent,
  PlayerStatus,
  testCards,
} from "../models/CodenamesTypes";
import "./CodenamesTeamSelection.css";
import { CodenamesGameState } from "./CodenamesGameState";

interface CodenamesTeamSelectionProps {
  socket: SocketService;
  username: string;
  playerList: Player[];
  roomCode: any;
}

interface CodenamesTeamSelectionState {
  playerList: Player[];
  currentTeam: Team;
  joinButtonHovered: Team;
  spymasterHovered: boolean;
  startHovered: boolean;
  gameStarted: boolean;
  gameState: GameStateEvent | null;
}

export class CodenamesTeamSelection extends React.Component<
  CodenamesTeamSelectionProps,
  CodenamesTeamSelectionState
> {
  constructor(props: CodenamesTeamSelectionProps) {
    super(props);
    const player = props.playerList.find(
      (player) => player.username === props.username
    );
    this.state = {
      playerList: props.playerList,
      currentTeam: player ? player.team : Team.NONE,
      joinButtonHovered: Team.NONE,
      spymasterHovered: false,
      startHovered: false,
      // gameStarted: false,
      gameStarted: true,
      // gameState: null,
      gameState: {
        playerList: props.playerList,
        cards: testCards,
        status: PlayerStatus.BLUE_GUESSING,
      },
    };
  }

  // SUBSCRIBE to GameStateEvent

  joinButtonColor(team: Team): CodenamesColors {
    if (team === Team.RED) {
      if (
        this.state.currentTeam === Team.RED ||
        this.state.joinButtonHovered === Team.RED
      ) {
        return CodenamesColors.RED_DARK;
      } else {
        return CodenamesColors.RED;
      }
    } else if (team === Team.BLUE) {
      if (
        this.state.currentTeam === Team.BLUE ||
        this.state.joinButtonHovered === Team.BLUE
      ) {
        return CodenamesColors.BLUE_DARK;
      } else {
        return CodenamesColors.BLUE;
      }
    } else {
      return CodenamesColors.WHITE;
    }
  }

  onClickJoinTeam(team: Team) {
    // SEND SOCKET ChooseRoleEvent
  }

  spymasterButtonColor() {
    const me = this.state.playerList.find(
      (player) => player.username === this.props.username
    );
    if (this.state.spymasterHovered || (me && me.spymaster)) {
      return CodenamesColors.GREEN_DARK;
    } else {
      return CodenamesColors.GREEN;
    }
  }

  onClickSpymasterButton() {
    // SEND SOCKET ChooseRoleEvent
  }

  startButtonColor() {
    if (this.state.startHovered) {
      return CodenamesColors.VIOLET_DARK;
    } else {
      return CodenamesColors.VIOLET;
    }
  }

  onClickStartButton() {
    // SEND SOCKET StartGameEvent
  }

  render() {
    return !this.state.gameStarted ? (
      <div className="codenamesTeamSelectionContainer">
        <div className="codenamesTeamSelectionLeft">
          <b>Red Team</b>
          <hr
            style={{
              border: "none",
              borderRadius: 5,
              background: CodenamesColors.RED,
              height: 10,
            }}
          />
          {this.state.playerList.map(
            (player) =>
              player.team === Team.RED && (
                <div style={{ color: CodenamesColors.RED }}>
                  {player.username}
                  {player.spymaster && " 🎩"}
                </div>
              )
          )}
        </div>
        <div className="codenamesTeamSelectionCenter">
          <b>Room Code: {this.props.roomCode.room_id}</b>
          <br />
          <br />
          {this.state.playerList.map(
            (player) =>
              player.team === Team.NONE && <div>{player.username}</div>
          )}
        </div>
        <div className="codenamesTeamSelectionRight">
          <b>Blue Team</b>
          <hr
            style={{
              border: "none",
              borderRadius: 5,
              background: CodenamesColors.BLUE,
              height: 10,
            }}
          />
          {this.state.playerList.map(
            (player) =>
              player.team === Team.BLUE && (
                <div style={{ color: CodenamesColors.BLUE }}>
                  {player.username}
                  {player.spymaster && " 🎩"}
                </div>
              )
          )}
        </div>
        {this.state.currentTeam !== Team.NONE && (
          <Fragment>
            {this.state.playerList[0].username === this.props.username && (
              <div
                className="codenamesStartButton"
                style={{
                  background: this.startButtonColor(),
                  cursor: "pointer",
                }}
                onMouseEnter={() => this.setState({ startHovered: true })}
                onMouseLeave={() => this.setState({ startHovered: false })}
                onClick={this.onClickStartButton}
              >
                <b>Start Game</b>
              </div>
            )}
            <div
              className="codenamesBeSpymasterButton"
              style={{
                background: this.spymasterButtonColor(),
                cursor: "pointer",
              }}
              onMouseEnter={() => this.setState({ spymasterHovered: true })}
              onMouseLeave={() => this.setState({ spymasterHovered: false })}
              onClick={this.onClickSpymasterButton}
            >
              <b>Be Spymaster</b>
            </div>
          </Fragment>
        )}
        <div className="codenamesJoinTeamButtons">
          <div
            className="joinRedTeamButton"
            style={{
              background: this.joinButtonColor(Team.RED),
              cursor: "pointer",
            }}
            onMouseEnter={() => this.setState({ joinButtonHovered: Team.RED })}
            onMouseLeave={() => this.setState({ joinButtonHovered: Team.NONE })}
            onClick={() => this.onClickJoinTeam(Team.RED)}
          >
            <b>Join Red Team</b>
          </div>
          <div
            className="joinBlueTeamButton"
            style={{
              background: this.joinButtonColor(Team.BLUE),
              cursor: "pointer",
            }}
            onMouseEnter={() => this.setState({ joinButtonHovered: Team.BLUE })}
            onMouseLeave={() => this.setState({ joinButtonHovered: Team.NONE })}
            onClick={() => this.onClickJoinTeam(Team.BLUE)}
          >
            <b>Join Blue Team</b>
          </div>
        </div>
      </div>
    ) : (
      this.state.gameState && (
        <CodenamesGameState
          socket={this.props.socket}
          username={this.props.username}
          gameState={this.state.gameState}
        />
      )
    );
  }
}
