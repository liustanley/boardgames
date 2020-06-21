import React from "react";
import { SocketService } from "../services/SocketService";
import { LobbyPayload, PlayerInfoPayload } from "../models/LoveLetterTypes";
import { LoveLetterColors } from "../models/LoveLetterTypes";
import "./LoveLetterContainer.css";
import { LoveLetterLobby } from "./LoveLetterLobby";
import { RouteComponentProps } from "react-router-dom";
import { UsernameInput } from "../homepage/UsernameInput";
import Cookies from "universal-cookie";
import { Games } from "../models/GameTypes";

interface LoveLetterContainerProps extends RouteComponentProps {
  socket: SocketService;
  cookies: Cookies;
}

interface LoveLetterContainerState {
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

    const prevSocketId = this.props.cookies.get("socketId");
    if (prevSocketId) {
      console.log("ENTERED");
      console.log("PREV: " + prevSocketId);
      const params: any = this.props.match.params;
      this.props.socket.rejoinGame(
        {
          prevSocketId: prevSocketId,
          game: Games.LOVE_LETTER,
          room: params.room_id,
        },
        (response: PlayerInfoPayload) => {
          this.setState({
            username: response.username,
            usernameList: response.usernameList,
          });
        }
      );
    }

    this.state = {
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
      const date = new Date();
      this.props.cookies.set("socketId", this.props.socket.getId(), {
        expires: new Date(date.getTime() + 10 * 60000),
      });
      this.setState({
        usernameList: payload.usernameList,
        reset: payload.reset || undefined,
      });
    } else {
      this.setState({ roomFullMessage: "Room is full!" });
    }
  }

  onEnter(username: string) {
    this.setState({ username });
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
            cookies={this.props.cookies}
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
