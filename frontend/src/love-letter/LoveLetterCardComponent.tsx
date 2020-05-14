import React, { Fragment } from "react";
import "./LoveLetterCardComponent.css";

interface LoveLetterCardComponentProps {
  number: number;
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
        style={{ background: props.numberToColor(props.number) }}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          props.onClick(e)
        }
      >
        <div className="loveLetterCardName">
          <b>{props.numberToName(props.number)}</b>
        </div>
      </div>
      <br></br>
      {props.selected && (
        <hr
          style={{
            background: props.numberToColor(props.number),
            height: "5px",
          }}
        ></hr>
      )}
    </Fragment>
  );
}

export default LoveLetterCardComponent;
