import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./JoinGameContainer.css";
import { SocketService } from "../services/SocketService";
import { Games } from "../models/GameTypes";

interface JoinGameState {
  code: string;
}

interface JoinGameProps extends RouteComponentProps {
  socket: SocketService;
  gameType: Games;
}

export class JoinGameContainer extends React.Component<
  JoinGameProps,
  JoinGameState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      code: "",
    };
  }

  onRoomCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ code: e.target.value.toUpperCase() });
  }

  onRoomCodeKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.props.socket.joinGame(
        {
          gameType: this.props.gameType,
          roomId: this.state.code,
        },
        (success: boolean) => {
          if (success) {
            this.props.history.push(
              `/${this.props.gameType}/${this.state.code}`
            );
          } else {
            // TODO error msg
          }
        }
      );
    }
  }

  render() {
    return (
      <div className="joinGameContainer">
        <input
          className="input"
          placeholder="Enter Room Code"
          onChange={this.onRoomCodeChange.bind(this)}
          onKeyPress={this.onRoomCodeKeyPress.bind(this)}
        ></input>
      </div>
    );
  }
}
