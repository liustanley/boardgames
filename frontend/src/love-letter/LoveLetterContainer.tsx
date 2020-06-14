import React from "react";
import { SocketService } from "../services/SocketService";
import { LobbyPayload } from "../models/LoveLetterTypes";
import { LoveLetterColors } from "../models/LoveLetterTypes";
import "./LoveLetterContainer.css";
import { LoveLetterLobby } from "./LoveLetterLobby";
import { RouteComponentProps } from "react-router-dom";
import { UsernameInput } from "../homepage/UsernameInput";

interface LoveLetterContainerProps extends RouteComponentProps {
  socket: SocketService;
}

interface LoveLetterContainerState {
  usernameEntered: boolean;
  username: string;
  input: string;
  roomFullMessage: string;
  usernameList: string[];
  reset?: boolean;
}

export class LoveLetterContainer extends React.Component<
  LoveLetterContainerProps,
  LoveLetterContainerState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      usernameEntered: false,
      // usernameEntered: true,
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
    this.props.socket.LOVE_LETTER.subscribeToLobby(this.onLobby.bind(this));
  }

  onLobby(payload: LobbyPayload) {
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

  onEnter(username: string) {
    this.setState({ username });
    // this.props.socket.registerPlayer({ username });
    this.props.socket.LOVE_LETTER.registerPlayer({ username });
  }

  setReset() {
    this.setState({ reset: false });
  }

  render() {
    return (
      <div className="loveLetterContainer">
        {this.state.usernameList.length === 0 ? (
          <div className="usernameInput">
            <UsernameInput onEnter={this.onEnter.bind(this)} />
            {this.state.roomFullMessage && (
              <p style={{ color: LoveLetterColors.RED }}>
                {this.state.roomFullMessage}
              </p>
            )}
          </div>
        ) : (
          <LoveLetterLobby
            socket={this.props.socket}
            usernameList={this.state.usernameList}
            username={this.state.username}
            reset={this.state.reset}
            setReset={this.setReset.bind(this)}
            roomCode={this.props.match.params}
          />
        )}
      </div>
    );
  }
}
