import React from "react";
import { ChatContainer } from "./containers/ChatContainer";
import { SocketService } from "./services/SocketService";
import "./App.css";

const socket: SocketService = new SocketService().init();

function App() {
  return <ChatContainer socket={socket} />;
}

export default App;
