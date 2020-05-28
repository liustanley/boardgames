import React from "react";
import { SocketService } from "../services/SocketService";
import { LobbyEvent } from "../models/types";
import { LoveLetterColors } from "../models/types";
import "./LoveLetterContainer.css";
import { LoveLetterLobby } from "./LoveLetterLobby";

const socket: SocketService = new SocketService().init();

interface LoveLetterContainerState {
  usernameEntered: boolean;
  username: string;
  input: string;
  roomFullMessage: string;
  usernameList: string[];
  reset?: boolean;
}

export class LoveLetterContainer extends React.Component<
  {},
  LoveLetterContainerState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      usernameEntered: false,
      // TODO:
      username: "",
      // username: "Dillon",
      input: "",
      roomFullMessage: "",
      // TODO:
      usernameList: [],
      // usernameList: ["Stanley", "Alex", "Annette", "Christina"],
      reset: false,
    };
  }

  componentDidMount() {
    socket.subscribeToLobby(this.onLobby.bind(this));
  }

  onLobby(payload: LobbyEvent) {
    console.log(JSON.stringify(payload));
    if (payload.success) {
      this.setState({
        usernameEntered: true,
        usernameList: payload.usernameList,
        reset: payload.reset || undefined,
      });
    } else {
      this.setState({ roomFullMessage: "Room is full!" });
    }
  }

  onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  onUsernameKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      socket.registerPlayer({ username: this.state.username });
    }
  }

  setReset() {
    this.setState({ reset: false });
  }

  render() {
    return (
      <div className="loveLetterContainer">
        {this.state.usernameList.length === 0 ? (
          <div className="usernameInput">
            <input
              className="input"
              value={this.state.username}
              placeholder="Enter your name"
              onChange={this.onUsernameChange.bind(this)}
              onKeyPress={this.onUsernameKeyPress.bind(this)}
            />
            {this.state.roomFullMessage && (
              <p style={{ color: LoveLetterColors.RED }}>
                {this.state.roomFullMessage}
              </p>
            )}
          </div>
        ) : (
          <LoveLetterLobby
            socket={socket}
            usernameList={this.state.usernameList}
            username={this.state.username}
            reset={this.state.reset}
            setReset={this.setReset.bind(this)}
          />
        )}
      </div>
    );
  }
}
