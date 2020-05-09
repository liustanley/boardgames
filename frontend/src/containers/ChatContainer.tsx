import React from "react";
import { ChatState, ChatMessage } from "../models/types";
import { SocketService } from "../services/SocketService";

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
      input: "",
      messages: [],
    };
  }

  componentDidMount() {
    this.props.socket.subscribeToChat(this.receiveMessage.bind(this));
  }

  onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ input: e.target.value });
  }

  sendMessage() {
    this.props.socket.send({
      author: "stanley",
      message: this.state.input,
    });
  }

  receiveMessage(message: ChatMessage) {
    let messages: ChatMessage[] = this.state.messages;
    messages.push(message);

    this.setState({ messages: messages });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.messages.map((msg: ChatMessage, index: number) => (
            <div key={index}>
              <p>{msg.author}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <input
          placeholder="Type your message here"
          onChange={this.onChangeInput.bind(this)}
        />
        <button onClick={this.sendMessage.bind(this)}>Send</button>
      </div>
    );
  }
}
