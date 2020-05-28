import React from "react";
import { LoveLetterContainer } from "./love-letter/LoveLetterContainer";
import "./App.css";

interface AppState {}

export class App extends React.Component<{}, AppState> {
  render() {
    return <LoveLetterContainer />;
  }
}
