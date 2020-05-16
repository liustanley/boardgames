import { GameState, PlayerStatus } from "./types";
import { Player } from "./Player";
import { Card } from "./Card";

export class LoveLetterModel {
  private players: Player[]; // list of Players in this LoveLetter Game
  private deck: Card[]; // list of remaining Cards
  private discardPile: Card[]; // list of discarded Cards
  private turn: number; // index of Player who's turn it is
  private message: string;

  constructor(deck: Card[]) {
    this.players = [];
    this.deck = deck;
    this.discardPile = [];
    this.turn = Math.floor(Math.random() * 4);
    this.message = "";
  }

  /**
   * Shuffles this game's deck using the Fisher-Yates shuffle algorithm.
   */
  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /**
   * Progresses this game to the next turn.
   */
  private nextTurn() {
    this.turn = this.turn === this.players.length - 1 ? 0 : this.turn + 1;
    this.players[this.turn].draw(this.deck.shift());
  }

  /**
   * Starts this love letter game by dealing out cards and instantiating each player's status.
   */
  public startGame(): void {
    // Shuffle deck
    this.shuffleDeck();

    // Deal out starting cards
    for (let p of this.players) {
      p.deal(this.deck.shift());
    }

    // Deal out first draw card
    this.players[this.turn].draw(this.deck.shift());
  }

  /**
   * In the turn stage, modifies this game when a Player selects a given Card.
   * @param username  the username of the Player selecting
   * @param selected  the selected Card
   */
  public selectCard(username: string, selected: Card): void {
    let currentPlayer: Player = this.players.find(
      (player) => player.username === username
    );
    this.message = currentPlayer.selectCard(selected);
    this.discardPile.push(selected);

    // These cards all don't require a Play action, and just progress to the next turn.
    if (
      selected === Card.HANDMAID ||
      selected === Card.COUNTESS ||
      selected === Card.PRINCESS
    ) {
      if (!this.roundOver()) {
        this.nextTurn();
      }
    }
  }

  /**
   * In the turn stage, modifies this game when a Player executes a play action.
   * @param username  the username of the Player initiating the play
   * @param selected  the selected Card to be played
   * @param target    the username of the Player being targeted by the play
   * @param guess     the Card being guessed in the case of a Guard play
   */
  public playCard(
    username: string,
    selected: Card,
    target: string,
    guess?: Card
  ): void {
    let currentPlayer: Player = this.players.find(
      (player) => player.username === username
    );
    let targetPlayer: Player = this.players.find(
      (player) => player.username === target
    );

    if (selected === Card.PRINCE) {
      this.discardPile.push(targetPlayer.card);
      targetPlayer.card = this.deck.shift();
    }

    currentPlayer.playCard(selected, targetPlayer, guess);
    if (!this.roundOver()) {
      this.nextTurn();
    }
  }

  /**
   * Returns the array of game states for each respective player stored in this game.
   */
  public gameState(): GameState[] {
    let result: GameState[] = [];

    for (let p of this.players) {
      let gs: GameState = {
        message: this.message,
        visibleCards: p.visibleCards,
        discardCards: this.discardPile,
        status: p.status,
      };

      if (
        p.status === PlayerStatus.GUESSING_CARD ||
        p.status === PlayerStatus.SELECTING_PLAYER
      ) {
        gs.visiblePlayers = this.players;
      }

      result.push(gs);
    }

    return result;
  }

  /**
   * Adds a given player to this game's list of players.
   * Returns whether the add was successful or not.
   * @param socketId  the socketId associated with this player
   * @param username  the username of the player to be added
   */
  public addPlayer(socketId: string, username: string): boolean {
    if (this.players.length === 4) {
      return false;
    } else {
      let newPlayer: Player = new Player(socketId, username);
      this.players.push(newPlayer);
      return true;
    }
  }

  /**
   * Returns the current list of players in this game.
   */
  public getPlayers(): Player[] {
    return this.players;
  }

  /**
   * Determines if this love letter round has ended.
   * A love letter round ends when there are no cards left in the deck or when only one player remains.
   */
  private roundOver(): boolean {
    let numAlive: number = 0;
    let winner: Player = undefined;
    for (let p of this.players) {
      if (p.status !== PlayerStatus.DEAD) {
        if (!winner || p.card.value > winner.card.value) {
          winner = p;
        }
        numAlive++;
      }
    }

    if (this.deck.length === 0 || numAlive === 1) {
      winner.tokens++;
      this.message = winner.username + "'s love letter reached the princess.";
      this.gameOver();
      return true;
    }

    return false;
  }

  /**
   * Determines if this love letter game has ended.
   * A love letter game ends when one player has obtained 4 tokens.
   */
  private gameOver(): boolean {
    for (let p of this.players) {
      if (p.tokens === 4) {
        this.message =
          "Game over. " +
          p.username +
          " has won the adoration of the princess.";
        return true;
      }
    }

    return false;
  }
}
