import React from "react";
import { ChatContainer } from "./chat/ChatContainer";
import { SocketService } from "./services/SocketService";
import "./App.css";
import { LoveLetterCardContainer } from "./love-letter/LoveLetterCardContainer";

const socket: SocketService = new SocketService().init();

function App() {
  return false ? (
    <div className="loveLetterPage">
      <LoveLetterCardContainer number={1} />
      <LoveLetterCardContainer number={2} />
      <LoveLetterCardContainer number={3} />
      <LoveLetterCardContainer number={4} />
      <br></br>
      <LoveLetterCardContainer number={5} />
      <LoveLetterCardContainer number={6} />
      <LoveLetterCardContainer number={7} />
      <LoveLetterCardContainer number={8} />
    </div>
  ) : (
    <ChatContainer socket={socket} />
  );
}

export default App;
