import React from "react";
import { ChatMessage } from "../models/types";
import "./ChatComponent.css";

function ChatComponent(props: any) {
  return (
    <div className="chatComponent">
      <div className="chatMessages" ref={props.chatRef}>
        {props.messages.map((msg: ChatMessage, index: number) => (
          <div key={index}>
            <p>
              <span style={{ color: props.userToColor(msg.author) }}>
                {msg.author}
              </span>
              : {msg.message}
            </p>
          </div>
        ))}
      </div>
      <hr />
      <div className="chatInput">
        <input
          value={props.messageValue}
          placeholder={props.messagePlaceholder}
          onChange={props.messageOnChange}
          onKeyPress={props.messageOnKeyPress}
        />
      </div>
    </div>
  );
}

export default ChatComponent;
