import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./JoinGameContainer.css";

interface JoinGameState {
  code: string;
}

export class JoinGameContainer extends React.Component<
  RouteComponentProps,
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
      let temp: any = this.props.match.params;
      this.props.history.push(`/${temp.gameType}/${this.state.code}`);
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
