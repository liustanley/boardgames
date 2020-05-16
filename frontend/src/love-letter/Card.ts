export class Card {
  static readonly GUARD = new Card("GUARD", 1, "Guess another player's card");
  static readonly PRIEST = new Card(
    "PRIEST",
    2,
    "Look at another player's card"
  );
  static readonly BARON = new Card(
    "BARON",
    3,
    "Compare cards with another player"
  );
  static readonly HANDMAID = new Card(
    "HANDMAID",
    4,
    "Make yourself immune for one turn"
  );
  static readonly PRINCE = new Card(
    "PRINCE",
    5,
    "Make a player discard their card"
  );
  static readonly KING = new Card("KING", 6, "Trade cards with another player");
  static readonly COUNTESS = new Card(
    "COUNTESS",
    7,
    "Discard if you have a Prince or King"
  );
  static readonly PRINCESS = new Card(
    "PRINCESS",
    8,
    "Lose if you discard this"
  );

  // private to disallow creating other instances of this type
  private constructor(
    private readonly key: string,
    public readonly value: number,
    public readonly description: string
  ) {}

  toString() {
    return this.key;
  }

  /**
   * Something janky happens when a Card is passed through sockets, so this function solves that problem
   * by correcting a list of socket cards.
   * @param cards the list of cards to be corrected
   */
  static correct(cards: Card[]) {
    let corrected: Card[] = [];

    for (let c of cards) {
      switch (c.value) {
        case 1:
          corrected.push(Card.GUARD);
          break;
        case 2:
          corrected.push(Card.PRIEST);
          break;
        case 3:
          corrected.push(Card.BARON);
          break;
        case 4:
          corrected.push(Card.HANDMAID);
          break;
        case 5:
          corrected.push(Card.PRINCE);
          break;
        case 6:
          corrected.push(Card.KING);
          break;
        case 7:
          corrected.push(Card.COUNTESS);
          break;
        case 8:
          corrected.push(Card.PRINCESS);
          break;
      }
    }

    return corrected;
  }
}
