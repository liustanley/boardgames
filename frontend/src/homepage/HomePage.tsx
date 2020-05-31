import React from "react";
import "./HomePage.css";
import { HomePageCard } from "./HomePageCard";
import { Games } from "../models/GameTypes";
import { RouteComponentProps } from "react-router-dom";

export class HomePage extends React.Component<RouteComponentProps, {}> {
  makeid(length: number) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  onCreate(game: string) {
    const code = this.makeid(4);
    this.props.history.push(`/${game}/${code}`);
  }

  onJoin(game: string) {
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
        </div>
        <div className="homepageRight"></div>
      </div>
    );
  }
}
