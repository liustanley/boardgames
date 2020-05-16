import * as express from "express";
import { createServer, Server } from "http";
import { SocketType } from "../types/constants";
import { LoveLetterController } from "../love-letter/LoveLetterController";
import { ChatServer } from "../chat/ChatServer";

var cors = require("cors");

export class ExpressServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: Server;
  private port: string | number;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ExpressServer.PORT;
    this._app.use(cors());
    this._app.options("*", cors());
    this.server = createServer(this._app);
    this.listen();
  }

  /**
   * Opens up communication for our Express server.
   */
  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
  }

  /**
   * Getter function to return the express app.
   */
  get app(): express.Application {
    return this._app;
  }

  /**
   * Instantiates and adds a socket server of the given type to this express server.
   * @param socketType the type of socket server to instantiate
   */
  public addSocket(socketType: SocketType): ExpressServer {
    switch (socketType) {
      case SocketType.CHAT:
        const chatServer: ChatServer = new ChatServer(this.server, this.port);
        return this;

      case SocketType.LOVE_LETTER:
        const loveLetter: LoveLetterController = new LoveLetterController(
          this.server,
          this.port
        );
        return this;
    }
    return this;
  }
}
