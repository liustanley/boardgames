import React from "react";
import "./LoveLetterCardComponent.css";

function LoveLetterCardComponent(props: any) {
  return (
    <div
      className="loveLetterCard"
      style={{ background: props.numberToColor(props.number) }}
    >
      <div className="loveLetterCardName">
        <b>{props.numberToName(props.number)}</b>
      </div>
    </div>
  );
}

export default LoveLetterCardComponent;
