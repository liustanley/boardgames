import React, { Fragment } from "react";
import { GameStateEvent, PlayerStatus } from "../models/types";
import { SocketService } from "../services/SocketService";
import { LoveLetterColors, cardGuessList } from "../models/types";
import "./LoveLetterGameState.css";
import { LoveLetterCardContainer } from "./LoveLetterCardContainer";
import { LoveLetterDeckCard } from "./LoveLetterDeckCard";
import { Card } from "./Card";

export interface LoveLetterGameStateProps {
  socket: SocketService;
  username: string;
  gameState: GameStateEvent;
}

export interface LoveLetterGameStateState {
  actionCompleted: boolean;
  leftSelected: boolean;
  rightSelected: boolean;
  cardSelected?: Card;
  nameHovered: number;
  nameClicked: number;
  cardNameClicked: number;
  cardNameHovered: number;
  hasSelectablePlayers: boolean;
}

export class LoveLetterGameState extends React.Component<
  LoveLetterGameStateProps,
  LoveLetterGameStateState
> {
  constructor(props: LoveLetterGameStateProps) {
    super(props);
    this.state = {
      actionCompleted: false,
      leftSelected: false,
      rightSelected: false,
      cardSelected: undefined,
      nameHovered: -1,
      nameClicked: -1,
      cardNameClicked: -1,
      cardNameHovered: -1,
      hasSelectablePlayers: this.checkHasSelectablePlayers(),
    };
  }

  componentDidUpdate(prevProps: LoveLetterGameStateProps) {
    if (this.props.gameState !== prevProps.gameState) {
      this.setState({
        actionCompleted: false,
        leftSelected: false,
        rightSelected: false,
        cardSelected: undefined,
        nameHovered: -1,
        nameClicked: -1,
        cardNameClicked: -1,
        cardNameHovered: -1,
        hasSelectablePlayers: this.checkHasSelectablePlayers(),
      });
    }
  }

  onSelectCard(value: Card) {
    if (
      this.props.gameState.visibleCards.includes(Card.COUNTESS) &&
      (this.props.gameState.visibleCards.includes(Card.KING) ||
        this.props.gameState.visibleCards.includes(Card.PRINCE)) &&
      value !== Card.COUNTESS
    ) {
      if (this.props.gameState.visibleCards[0] === Card.COUNTESS) {
        this.setState({ cardSelected: undefined, rightSelected: false });
      } else {
        this.setState({ cardSelected: undefined, leftSelected: false });
      }
    } else {
      this.setState({ cardSelected: value });
    }
  }

  clearLeftCard() {
    this.setState({ leftSelected: false, rightSelected: true });
  }

  clearRightCard() {
    this.setState({ rightSelected: false, leftSelected: true });
  }

  onSendSelectedCard() {
    if (this.state.cardSelected) {
      this.props.socket.selectCard({
        username: this.props.username,
        card: this.state.cardSelected,
      });
      this.setState({
        actionCompleted: true,
        cardSelected: undefined,
        leftSelected: false,
        rightSelected: false,
      });
    }
  }

  onPlayCard() {
    const payload: any = {};
    if (this.state.nameClicked > -1 && this.props.gameState.visiblePlayers) {
      payload.target = this.props.gameState.visiblePlayers[
        this.state.nameClicked
      ].username;
    }
    if (this.state.cardNameClicked > -1) {
      payload.guess = cardGuessList[this.state.cardNameClicked];
    }
    payload.username = this.props.username;
    this.props.socket.playCard(payload);
    this.setState({
      actionCompleted: true,
      nameClicked: -1,
      cardNameClicked: -1,
    });
  }

  onConfirm() {
    this.props.socket.confirm({ username: this.props.username });
    this.setState({ actionCompleted: true });
  }

  onNameEnter(index: number) {
    this.setState({ nameHovered: index });
  }

  onNameLeave(index: number) {
    this.setState({ nameHovered: -1 });
  }

  onNameClick(index: number) {
    if (this.state.cardNameClicked > -1) {
      this.props.socket.highlight({
        username: this.props.username,
        player:
          this.props.gameState.visiblePlayers &&
          this.props.gameState.visiblePlayers[index],
        card: cardGuessList[this.state.cardNameClicked],
      });
    } else {
      this.props.socket.highlight({
        username: this.props.username,
        player:
          this.props.gameState.visiblePlayers &&
          this.props.gameState.visiblePlayers[index],
      });
    }
    this.setState({ nameClicked: index });
  }

  onCardNameEnter(index: number) {
    this.setState({ cardNameHovered: index });
  }

  onCardNameLeave(index: number) {
    this.setState({ cardNameHovered: -1 });
  }

  onCardNameClick(index: number) {
    if (this.state.nameClicked > -1) {
      this.props.socket.highlight({
        username: this.props.username,
        player:
          this.props.gameState.visiblePlayers &&
          this.props.gameState.visiblePlayers[this.state.nameClicked],
        card: cardGuessList[index],
      });
    } else {
      this.props.socket.highlight({
        username: this.props.username,
        card: cardGuessList[index],
      });
    }
    this.setState({ cardNameClicked: index });
  }

  checkHasSelectablePlayers(): boolean {
    if (this.props.gameState.visiblePlayers) {
      for (const player of this.props.gameState.visiblePlayers) {
        if (
          player.status !== PlayerStatus.DEAD &&
          !player.immune &&
          player.selfSelectable !== false
        ) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    return (
      <Fragment>
        <div className="loveLetterGameState">
          <div className="deck">
            {this.props.gameState.discardCards &&
              this.props.gameState.discardCards.map((card, index) => (
                <LoveLetterDeckCard number={card.value} index={index} />
              ))}
          </div>
          <hr color={LoveLetterColors.WHITE}></hr>
          <div className="gameMessage">
            <b>{this.props.gameState.message}</b>
          </div>
          <hr color={LoveLetterColors.WHITE}></hr>
          {!this.state.hasSelectablePlayers &&
            (this.props.gameState.status === PlayerStatus.SELECTING_PLAYER ||
              this.props.gameState.status === PlayerStatus.GUESSING_CARD ||
              this.props.gameState.status === PlayerStatus.WATCHING) && (
              <Fragment>
                <div
                  className="gameMessage"
                  style={{ color: LoveLetterColors.RED }}
                >
                  <b>No players selectable</b>
                </div>
                <hr color={LoveLetterColors.WHITE}></hr>
              </Fragment>
            )}
          {(this.props.gameState.status === PlayerStatus.WAITING ||
            this.props.gameState.status === PlayerStatus.VIEWING_CARD) && (
            <div className="cardContainer">
              {this.props.gameState.visibleCards.map((card) => (
                <div className="card">
                  <LoveLetterCardContainer card={card} />
                </div>
              ))}
            </div>
          )}
          {this.props.gameState.status === PlayerStatus.WATCHING && (
            <Fragment>
              <br></br>
              <div className="playerList">
                <hr style={{ color: LoveLetterColors.WHITE, margin: 0 }}></hr>
                {this.props.gameState.visiblePlayers?.map((player, index) => (
                  <Fragment>
                    {this.props.gameState.visiblePlayers &&
                    !this.props.gameState.visiblePlayers[index].immune &&
                    this.props.gameState.visiblePlayers[index].status !==
                      PlayerStatus.DEAD &&
                    this.props.gameState.visiblePlayers[index]
                      .selfSelectable !== false ? (
                      <Fragment>
                        <div
                          className="playerName"
                          style={{
                            background:
                              this.props.gameState.visiblePlayers &&
                              JSON.stringify(
                                this.props.gameState.highlightedPlayer
                              ) ===
                                JSON.stringify(
                                  this.props.gameState.visiblePlayers[index]
                                )
                                ? LoveLetterColors.BACKGROUND_BLUE
                                : LoveLetterColors.BACKGROUND_DARK,
                          }}
                        >
                          <b>{player.username}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div
                          className="playerName"
                          style={{
                            background: LoveLetterColors.BACKGROUND_BLACK,
                          }}
                        >
                          <b>{player.username}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    )}
                  </Fragment>
                ))}
              </div>
              <br></br>
              {this.props.gameState.watchingGuardPlay && (
                <Fragment>
                  <div className="cardList">
                    <hr
                      style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                    ></hr>
                    {cardGuessList.map((card, index) => (
                      <Fragment>
                        <div
                          className="cardName"
                          style={{
                            background:
                              JSON.stringify(
                                this.props.gameState.highlightedCard
                              ) === JSON.stringify(cardGuessList[index])
                                ? LoveLetterColors.BACKGROUND_BLUE
                                : LoveLetterColors.BACKGROUND_DARK,
                          }}
                        >
                          <b>{card.toString()}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
          {this.props.gameState.status === PlayerStatus.SELECTING_CARD && (
            <div className="cardContainer">
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[0]}
                  onSelectCard={this.onSelectCard.bind(this)}
                  selected={this.state.leftSelected}
                  clearSelected={this.clearRightCard.bind(this)}
                />
              </div>
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[1]}
                  onSelectCard={this.onSelectCard.bind(this)}
                  selected={this.state.rightSelected}
                  clearSelected={this.clearLeftCard.bind(this)}
                />
              </div>
            </div>
          )}
          {this.props.gameState.status === PlayerStatus.COMPARING_CARDS && (
            <div className="cardContainer">
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[0]}
                />
              </div>
              <div className="card">
                <LoveLetterCardContainer
                  card={this.props.gameState.visibleCards[1]}
                />
              </div>
            </div>
          )}
          {this.props.gameState.status === PlayerStatus.SELECTING_PLAYER && (
            <Fragment>
              <br></br>
              <div className="playerList">
                <hr style={{ color: LoveLetterColors.WHITE, margin: 0 }}></hr>
                {this.props.gameState.visiblePlayers?.map((player, index) => (
                  <Fragment>
                    {this.props.gameState.visiblePlayers &&
                    !this.props.gameState.visiblePlayers[index].immune &&
                    this.props.gameState.visiblePlayers[index].status !==
                      PlayerStatus.DEAD &&
                    this.props.gameState.visiblePlayers[index]
                      .selfSelectable !== false ? (
                      <Fragment>
                        <div
                          className="playerName"
                          style={{
                            background:
                              this.state.nameClicked === index
                                ? LoveLetterColors.BACKGROUND_BLUE
                                : this.state.nameHovered === index
                                ? LoveLetterColors.BACKGROUND_DARK
                                : LoveLetterColors.BACKGROUND_LIGHT,
                          }}
                          onMouseEnter={(event) => this.onNameEnter(index)}
                          onMouseLeave={(event) => this.onNameLeave(index)}
                          onClick={(event) => this.onNameClick(index)}
                        >
                          <b>{player.username}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div
                          className="playerName"
                          style={{
                            background: LoveLetterColors.BACKGROUND_BLACK,
                          }}
                        >
                          <b>{player.username}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    )}
                  </Fragment>
                ))}
              </div>
            </Fragment>
          )}
          {this.props.gameState.status === PlayerStatus.GUESSING_CARD && (
            <Fragment>
              <br></br>
              <div className="playerList">
                <hr style={{ color: LoveLetterColors.WHITE, margin: 0 }}></hr>
                {this.props.gameState.visiblePlayers?.map((player, index) => (
                  <Fragment>
                    {this.props.gameState.visiblePlayers &&
                    !this.props.gameState.visiblePlayers[index].immune &&
                    this.props.gameState.visiblePlayers[index].status !==
                      PlayerStatus.DEAD &&
                    this.props.gameState.visiblePlayers[index]
                      .selfSelectable !== false ? (
                      <Fragment>
                        <div
                          className="playerName"
                          style={{
                            background:
                              this.state.nameClicked === index
                                ? LoveLetterColors.BACKGROUND_BLUE
                                : this.state.nameHovered === index
                                ? LoveLetterColors.BACKGROUND_DARK
                                : LoveLetterColors.BACKGROUND_LIGHT,
                          }}
                          onMouseEnter={(event) => this.onNameEnter(index)}
                          onMouseLeave={(event) => this.onNameLeave(index)}
                          onClick={(event) => this.onNameClick(index)}
                        >
                          <b>{player.username}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div
                          className="playerName"
                          style={{
                            background: LoveLetterColors.BACKGROUND_BLACK,
                          }}
                        >
                          <b>{player.username}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    )}
                  </Fragment>
                ))}
              </div>
              <br></br>
              {this.state.hasSelectablePlayers && (
                <Fragment>
                  <div className="cardList">
                    <hr
                      style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                    ></hr>
                    {cardGuessList.map((card, index) => (
                      <Fragment>
                        <div
                          className="cardName"
                          style={{
                            background:
                              this.state.cardNameClicked === index
                                ? LoveLetterColors.BACKGROUND_BLUE
                                : this.state.cardNameHovered === index
                                ? LoveLetterColors.BACKGROUND_DARK
                                : LoveLetterColors.BACKGROUND_LIGHT,
                          }}
                          onMouseEnter={(event) => this.onCardNameEnter(index)}
                          onMouseLeave={(event) => this.onCardNameLeave(index)}
                          onClick={(event) => this.onCardNameClick(index)}
                        >
                          <b>{card.toString()}</b>
                        </div>
                        <hr
                          style={{ color: LoveLetterColors.WHITE, margin: 0 }}
                        ></hr>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
        {this.props.gameState.status === PlayerStatus.SELECTING_CARD &&
          !this.state.actionCompleted && (
            <div
              className="readyButton"
              onClick={this.onSendSelectedCard.bind(this)}
            >
              <b>{this.state.cardSelected ? "Play Card" : "Select a Card"}</b>
            </div>
          )}
        {(this.props.gameState.status === PlayerStatus.VIEWING_CARD ||
          this.props.gameState.status === PlayerStatus.COMPARING_CARDS) &&
          !this.state.actionCompleted && (
            <div className="readyButton" onClick={this.onConfirm.bind(this)}>
              <b>OK</b>
            </div>
          )}
        {this.props.gameState.status === PlayerStatus.SELECTING_PLAYER &&
          this.state.nameClicked > -1 &&
          !this.state.actionCompleted && (
            <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
              <b>Select Player</b>
            </div>
          )}
        {this.props.gameState.status === PlayerStatus.GUESSING_CARD &&
          this.state.nameClicked > -1 &&
          this.state.cardNameClicked > -1 &&
          !this.state.actionCompleted && (
            <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
              <b>Select Player</b>
            </div>
          )}
        {(this.props.gameState.status === PlayerStatus.SELECTING_PLAYER ||
          this.props.gameState.status === PlayerStatus.GUESSING_CARD) &&
          !this.state.hasSelectablePlayers &&
          !this.state.actionCompleted && (
            <div className="readyButton" onClick={this.onPlayCard.bind(this)}>
              <b>OK</b>
            </div>
          )}
      </Fragment>
    );
  }
}
