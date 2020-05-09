import React, { useState, useEffect } from 'react';
import { ChatContainer } from "./containers/ChatContainer";
import { SocketService } from "./services/SocketService";

const socket: SocketService = new SocketService().init();

function App() {
  return (
    <div>
      <ChatContainer socket={socket} />
    </div>
  );
}

export default App;