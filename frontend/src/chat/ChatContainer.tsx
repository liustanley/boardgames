import React, { createRef } from "react";
import ChatComponent from "./ChatComponent";
import { ChatState, ChatMessage } from "../models/types";
import { SocketService } from "../services/SocketService";
import { LoveLetterColors } from "../models/constants";
import "./ChatContainer.css";

interface ChatContainerProps {
  socket: SocketService;
}

export class ChatContainer extends React.Component<
  ChatContainerProps,
  ChatState
> {
  constructor(props: ChatContainerProps) {
    super(props);
    this.state = {
      usernameEntered: false,
      username: "",
      input: "",
      messages: [],
      userColors: [
        LoveLetterColors.RED,
        LoveLetterColors.ORANGE,
        LoveLetterColors.YELLOW,
        LoveLetterColors.GREEN,
        LoveLetterColors.TEAL,
        LoveLetterColors.BLUE,
        LoveLetterColors.VIOLET,
        LoveLetterColors.PINK,
      ],
      userToColorMap: new Map<string, string>(),
    };
  }

  private chatRef: React.RefObject<HTMLDivElement> = createRef();

  componentDidMount() {
    this.props.socket.subscribeToChat(this.receiveMessage.bind(this));
  }

  onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ input: e.target.value });
  }

  onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.state.input) {
      this.props.socket.send({
        author: this.state.username,
        message: this.state.input,
      });
      this.setState({ input: "" });
    }
  }

  receiveMessage(message: ChatMessage) {
    let messages: ChatMessage[] = this.state.messages;
    messages.push(message);

    this.setState({ messages }, () => {
      const chatDiv = this.chatRef.current;
      if (chatDiv) {
        chatDiv.scrollTop = chatDiv.scrollHeight;
      }
    });
  }

  onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  onUsernameKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.setState({ usernameEntered: true });
      this.props.socket.send({
        author: this.state.username,
        message: "is entering the chat. Welcome!",
      });
      const color: String = this.pickUserColor();
      this.state.userToColorMap.set(this.state.username, color);
    }
  }

  pickUserColor(): String {
    if (this.state.userColors.length === 0) {
      return "white";
    }
    const colorIndex: number = Math.floor(
      Math.random() * this.state.userColors.length
    );
    const color: String = this.state.userColors[colorIndex];
    this.state.userColors.splice(colorIndex, 1);
    return color;
  }

  userToColor(username: string): String {
    const userColor = this.state.userToColorMap.get(username);
    if (userColor) {
      return userColor;
    } else {
      const color: String = this.pickUserColor();
      this.state.userToColorMap.set(username, color);
      return color;
    }
  }

  render() {
    return !this.state.usernameEntered ? (
      <div className="usernameInput">
        <input
          className="input"
          value={this.state.username}
          placeholder="Enter your name"
          onChange={this.onUsernameChange.bind(this)}
          onKeyPress={this.onUsernameKeyPress.bind(this)}
        />
      </div>
    ) : (
      <ChatComponent
        messages={this.state.messages}
        messageValue={this.state.input}
        messagePlaceholder="Type your message here"
        messageOnChange={this.onChangeInput.bind(this)}
        messageOnKeyPress={this.onKeyPress.bind(this)}
        userToColor={this.userToColor.bind(this)}
        chatRef={this.chatRef}
      />
    );
  }
}
