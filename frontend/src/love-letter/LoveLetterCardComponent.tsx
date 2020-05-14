import React, { Fragment } from "react";
import "./LoveLetterCardComponent.css";
import { Card } from "./Card";

interface LoveLetterCardComponentProps {
  card: Card;
  numberToColor: Function;
  numberToName: Function;
  onClick: Function;
  selected?: boolean;
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function LoveLetterCardComponent(props: LoveLetterCardComponentProps) {
  return (
    <Fragment>
      <div
        className="loveLetterCard"
        style={{ background: props.numberToColor(props.card) }}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          props.onClick(e)
        }
      >
        <div className="loveLetterCardName">
          <b>{props.numberToName(props.card)}</b>
        </div>
      </div>
      <br></br>
      {props.selected && (
        <hr
          style={{
            background: props.numberToColor(props.card),
            height: "5px",
            border: "0px",
          }}
        ></hr>
      )}
    </Fragment>
  );
}

export default LoveLetterCardComponent;
