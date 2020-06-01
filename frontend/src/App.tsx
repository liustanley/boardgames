import React, { Fragment } from "react";
import { LoveLetterContainer } from "./love-letter/LoveLetterContainer";
import "./App.css";
import { Games } from "./models/GameTypes";
import { HomePage } from "./homepage/HomePage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { JoinGameContainer } from "./homepage/JoinGameContainer";

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path={`/${Games.LOVE_LETTER}/:room_id`}
              component={LoveLetterContainer}
            />
            <Route
              exact
              path={`/:gameType`}
              render={(props) => (
                <JoinGameContainer
                  {...props}
                  gameType={props.match.params.gameType}
                />
              )}
            />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}
