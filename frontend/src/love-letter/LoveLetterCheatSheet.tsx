import React, { Fragment } from "react";
import styled from "styled-components";
import { LoveLetterCardContainer } from "./LoveLetterCardContainer";
import { Card } from "./Card";

const Overlay = styled.div`
  position: fixed;
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); /* Black background with opacity */
  z-index: 2;
  padding-top: 32px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

interface LoveLetterCheatSheetProps {
  closeOverlay: () => void;
}

function LoveLetterCheatSheet(props: LoveLetterCheatSheetProps) {
  return (
    <Overlay onClick={props.closeOverlay}>
      <Row>
        <LoveLetterCardContainer cheatSheet={true} card={Card.GUARD} />
        <LoveLetterCardContainer cheatSheet={true} card={Card.PRIEST} />
        <LoveLetterCardContainer cheatSheet={true} card={Card.BARON} />
        <LoveLetterCardContainer cheatSheet={true} card={Card.HANDMAID} />
      </Row>
      <Row>
        <LoveLetterCardContainer cheatSheet={true} card={Card.PRINCE} />
        <LoveLetterCardContainer cheatSheet={true} card={Card.KING} />
        <LoveLetterCardContainer cheatSheet={true} card={Card.COUNTESS} />
        <LoveLetterCardContainer cheatSheet={true} card={Card.PRINCESS} />
      </Row>
    </Overlay>
  );
}

export default LoveLetterCheatSheet;
