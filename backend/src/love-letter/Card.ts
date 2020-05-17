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
  static correct(c: Card) {
    switch (c.value) {
      case 1:
        return Card.GUARD;
      case 2:
        return Card.PRIEST;
      case 3:
        return Card.BARON;
      case 4:
        return Card.HANDMAID;
      case 5:
        return Card.PRINCE;
      case 6:
        return Card.KING;
      case 7:
        return Card.COUNTESS;
      case 8:
        return Card.PRINCESS;
    }
  }
}
