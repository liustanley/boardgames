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
  numberToColorDark: Function;
  selectable?: boolean;
  cheatSheet?: boolean;
}

function LoveLetterCardComponent(props: LoveLetterCardComponentProps) {
  return (
    <Fragment>
      <div
        className={
          "loveLetterCard" +
          (props.selectable ? " selectableCard" : "") +
          (props.cheatSheet ? " cheatSheetCard" : "")
        }
        style={{ background: props.numberToColor(props.card) }}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          props.onClick(e)
        }
      >
        <div className="loveLetterCardTop">
          <div
            className="loveLetterCardName"
            style={{ background: props.numberToColorDark(props.card) }}
          >
            <b>{props.card.toString()}</b>
          </div>
        </div>
        <div
          className="loveLetterCardDescription"
          style={{ background: props.numberToColorDark(props.card) }}
        >
          <div className="loveLetterCardValue">{props.card.value}</div>
          <div>
            <b>{props.card.description}</b>
          </div>
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
