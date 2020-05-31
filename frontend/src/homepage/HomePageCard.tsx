import React from "react";
import { LoveLetterColors } from "../models/LoveLetterTypes";
import "./HomePageCard.css";

interface HomePageCardProps {
  game: string;
  onCreate: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onJoin: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface HomePageCardState {
  createHover: boolean;
  joinHover: boolean;
}

export class HomePageCard extends React.Component<
  HomePageCardProps,
  HomePageCardState
> {
  constructor(props: HomePageCardProps) {
    super(props);
    this.state = {
      createHover: false,
      joinHover: false,
    };
  }

  createMouseEnter() {
    this.setState({ createHover: true });
  }

  createMouseLeave() {
    this.setState({ createHover: false });
  }

  joinMouseEnter() {
    this.setState({ joinHover: true });
  }

  joinMouseLeave() {
    this.setState({ joinHover: false });
  }

  render() {
    return (
      <div
        className="button"
        style={{ background: LoveLetterColors.BACKGROUND_BLUE }}
      >
        <div className="buttonContents">
          <div className="buttonLabel">{this.props.game}</div>
          <div className="buttonOptions">
            <div
              className="buttonOption"
              style={{
                background: this.state.createHover
                  ? LoveLetterColors.GREEN_DARK
                  : LoveLetterColors.GREEN,
              }}
              onMouseEnter={this.createMouseEnter.bind(this)}
              onMouseLeave={this.createMouseLeave.bind(this)}
              onClick={this.props.onCreate}
            >
              Create
            </div>
            <div
              className="buttonOption"
              style={{
                background: this.state.joinHover
                  ? LoveLetterColors.VIOLET_DARK
                  : LoveLetterColors.VIOLET,
              }}
              onMouseEnter={this.joinMouseEnter.bind(this)}
              onMouseLeave={this.joinMouseLeave.bind(this)}
              onClick={this.props.onJoin}
            >
              Join
            </div>
          </div>
        </div>
      </div>
    );
  }
}
