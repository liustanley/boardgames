import React, { Fragment } from "react";
import { LoveLetterContainer } from "./love-letter/LoveLetterContainer";
import "./App.css";
import { Games } from "./models/GameTypes";
import { HomePage } from "./homepage/HomePage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { JoinGameContainer } from "./homepage/JoinGameContainer";
import { CodenamesContainer } from "./codenames/CodenamesContainer";
import { SocketService } from "./services/SocketService";

const socket: SocketService = new SocketService().init();

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <Fragment>
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => <HomePage {...props} socket={socket} />}
            />
            <Route
              exact
              path={`/:gameType`}
              render={(props) => (
                <JoinGameContainer
                  {...props}
                  socket={socket}
                  gameType={props.match.params.gameType}
                />
              )}
            />
            <Route
              exact
              path={`/${Games.LOVE_LETTER}/:room_id`}
              render={(props) => (
                <LoveLetterContainer {...props} socket={socket} />
              )}
            />
            <Route
              exact
              path={`/${Games.CODENAMES}/:room_id`}
              render={(props) => (
                <CodenamesContainer {...props} socket={socket} />
              )}
            />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}
