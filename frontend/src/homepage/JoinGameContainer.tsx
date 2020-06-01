import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./JoinGameContainer.css";

interface JoinGameState {
  code: string;
}

interface JoinGameProps extends RouteComponentProps {
  gameType: string;
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
    this.setState({ code: e.target.value });
  }

  onRoomCodeKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.props.history.push(`/${this.props.gameType}/${this.state.code}`);
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
