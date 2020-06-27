import React from "react";
import "./HomePage.css";
import { HomePageCard } from "./HomePageCard";
import { Games } from "../models/GameTypes";
import { RouteComponentProps } from "react-router-dom";
import { SocketService } from "../services/SocketService";

interface HomePageProps extends RouteComponentProps {
  socket: SocketService;
}

export class HomePage extends React.Component<HomePageProps, {}> {
  onCreate(game: Games) {
    this.props.socket.createGame({ gameType: game }, (roomCode: string) => {
      this.props.history.push(`/${game}/${roomCode}`);
    });
  }

  onJoin(game: Games) {
    this.props.history.push(`/${game}`);
  }

  render() {
    return (
      <div className="homePageContainer">
        <div className="homepageLeft"></div>
        <div className="homepageCenter">
          <HomePageCard
            game="Love Letter"
            onCreate={() => this.onCreate(Games.LOVE_LETTER)}
            onJoin={() => this.onJoin(Games.LOVE_LETTER)}
          />
          <HomePageCard
            game="Codenames"
            onCreate={() => this.onCreate(Games.CODENAMES)}
            onJoin={() => this.onJoin(Games.CODENAMES)}
          />
        </div>
        <div className="homepageRight"></div>
      </div>
    );
  }
}
