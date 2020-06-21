import React from "react";
import "./ChatComponent.css";
import { ChatMessagePayload } from "../models/GameTypes";

function ChatComponent(props: any) {
  return (
    <div
      className="chatComponent"
      style={{
        fontSize: props.size === "big" ? 24 : 20,
        padding: props.size === "big" ? 50 : 20,
        lineHeight: props.size === "big" ? "48px" : "30px",
      }}
    >
      <div className="chatMessages" ref={props.chatRef}>
        {props.messages.map((msg: ChatMessagePayload, index: number) => (
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
        {props.gameInProgress && (
          <button className="cheatSheet" onClick={props.openCheatSheet}>
            Cheat Sheet
          </button>
        )}
        <input
          className="input"
          type="text"
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
