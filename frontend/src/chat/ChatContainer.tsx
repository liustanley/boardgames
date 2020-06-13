import React, { createRef } from "react";
import ChatComponent from "./ChatComponent";
import { ChatState, ChatMessageEvent } from "../models/LoveLetterTypes";
import { SocketService } from "../services/SocketService";
import { LoveLetterColors } from "../models/LoveLetterTypes";
import "./ChatContainer.css";

interface ChatContainerProps {
  socket: SocketService;
  username: string;
  size: "big" | "small";
}

export class ChatContainer extends React.Component<
  ChatContainerProps,
  ChatState
> {
  constructor(props: ChatContainerProps) {
    super(props);
    this.state = {
      username: props.username,
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
    this.props.socket.sendChatMessage({
      author: this.state.username,
      message: "is entering the chat. Welcome!",
    });
    const color: String = this.pickUserColor();
    this.state.userToColorMap.set(this.state.username, color);
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
      this.props.socket.sendChatMessage({
        author: this.state.username,
        message: this.state.input,
      });
      this.setState({ input: "" });
    }
  }

  receiveMessage(message: ChatMessageEvent) {
    let messages: ChatMessageEvent[] = this.state.messages;
    messages.push(message);

    this.setState({ messages }, () => {
      const chatDiv = this.chatRef.current;
      if (chatDiv) {
        chatDiv.scrollTop = chatDiv.scrollHeight;
      }
    });
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
    return (
      <ChatComponent
        messages={this.state.messages}
        messageValue={this.state.input}
        messagePlaceholder="Type your message here"
        messageOnChange={this.onChangeInput.bind(this)}
        messageOnKeyPress={this.onKeyPress.bind(this)}
        userToColor={this.userToColor.bind(this)}
        chatRef={this.chatRef}
        size={this.props.size}
      />
    );
  }
}
