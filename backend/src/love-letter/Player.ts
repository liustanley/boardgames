import { PlayerStatus } from "./types";
import { Card } from "./Card";

export class Player {
  id: string; // socket id
  username: string; // user input username
  tokens?: number;
  card?: Card;
  drawCard?: Card;
  visibleCards?: Card[];
  immune?: boolean;
  status?: PlayerStatus;
  selfSelectable?: boolean;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.tokens = 0;
  }

  /**
   * Modifies this Player when they are first dealt into a round.
   * @param card  the given card being dealt to this Player
   */
  public deal(card: Card): void {
    this.card = card;
    this.drawCard = undefined;
    this.visibleCards = [card];
    this.immune = false;
    this.status = PlayerStatus.WAITING;
    this.selfSelectable = undefined;
  }

  /**
   * Modifies this Player when they are drawing a given card.
   * @param drawCard  the given card to be drawn
   */
  public draw(drawCard: Card): void {
    this.drawCard = drawCard;
    this.visibleCards = [this.card, drawCard];
    this.status = PlayerStatus.SELECTING_CARD;
    this.immune = false;
  }

  /**
   * Modifies this Player when they have selected a given Card and returns the respective client message.
   * @param selected  the given card that has been selected
   */
  public selectCard(selected: Card): string {
    if (this.card === selected) {
      this.card = this.drawCard;
      this.drawCard = undefined;
    } else if (this.drawCard === selected) {
      this.drawCard = undefined;
    } else {
      throw Error("Player does not have the selected Card.");
    }

    this.selfSelectable = undefined;
    this.visibleCards = [];
    this.immune = false;

    switch (selected) {
      case Card.GUARD:
        this.status = PlayerStatus.GUESSING_CARD;
        this.selfSelectable = false;
        return (
          "Choose another player and name a non-Guard card. " +
          "If that player has that card, he or she is out of the round."
        );

      case Card.PRIEST:
        this.status = PlayerStatus.SELECTING_PLAYER;
        this.selfSelectable = false;
        return "Look at another player's hand.";

      case Card.BARON:
        this.status = PlayerStatus.SELECTING_PLAYER;
        this.selfSelectable = false;
        return (
          "You and another player secretly compare hands. " +
          "The player with the lower value is out of the round."
        );

      case Card.HANDMAID:
        this.status = PlayerStatus.WAITING;
        this.visibleCards = [this.card];
        this.immune = true;
        return this.username + " played the Handmaid";

      case Card.PRINCE:
        this.status = PlayerStatus.SELECTING_PLAYER;
        this.selfSelectable = true;
        return "Choose any player (including yourself) to discard his or her hand and draw a new card.";

      case Card.KING:
        this.status = PlayerStatus.SELECTING_PLAYER;
        this.selfSelectable = false;
        return "Trade hands with another player of your choice.";

      case Card.COUNTESS:
        this.status = PlayerStatus.WAITING;
        this.visibleCards = [this.card];
        return this.username + " played the Countess";

      case Card.PRINCESS:
        this.status = PlayerStatus.DEAD;
        this.visibleCards = [];
        this.card = undefined;
        return this.username + " played the Princess";
    }
  }

  /**
   * Modifies this player when they have executed a play action with a given Card,
   * and returns the respective client message
   * @param selected  the card that is being played
   * @param target    the player being targeted by this play
   * @param guess     the card being guessed by this play, in the case of a Guard
   */
  playCard(selected: Card, target: Player, guess?: Card): string {
    this.selfSelectable = undefined;

    switch (selected) {
      case Card.GUARD:
        this.status = PlayerStatus.WAITING;
        this.visibleCards = [this.card];
        if (!guess) {
          throw Error("Guard play must have a guessed card.");
        }

        let guardMessage: string =
          this.username +
          " suspected " +
          target.username +
          " of having the " +
          guess +
          " and was ";
        if (target.card === guess) {
          target.status = PlayerStatus.DEAD;
          target.card = undefined;
          target.visibleCards = [];
          return guardMessage + "correct.";
        } else {
          return guardMessage + "incorrect.";
        }

      case Card.PRIEST:
        this.status = PlayerStatus.VIEWING_CARD;
        this.visibleCards = [target.card];
        return this.username + " looked at " + target.username + "'s hand.";

      case Card.BARON:
        this.status = PlayerStatus.COMPARING_CARDS;
        this.visibleCards = [this.card, target.card];
        target.visibleCards = [this.card, target.card];

        let baronMessage: string =
          this.username + " compared cards with " + target.username + " and ";
        if (this.card.value > target.card.value) {
          return baronMessage + "won.";
        } else if (this.card.value < target.card.value) {
          return baronMessage + "lost.";
        } else {
          return baronMessage + "drew.";
        }

      case Card.PRINCE:
        this.visibleCards = [this.card];
        target.visibleCards = [target.card];
        return this.username + " played the Prince on " + target.username;

      case Card.KING:
        this.status = PlayerStatus.WAITING;
        let temp: Card = this.card;
        this.card = target.card;
        target.card = temp;

        this.visibleCards = [this.card];
        target.visibleCards = [target.card];
        return this.username + " played the King on " + target.username;
    }
  }
}
