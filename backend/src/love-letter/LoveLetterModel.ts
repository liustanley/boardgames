import { GameState, PlayerStatus } from "./types";
import { Player } from "./Player";
import { Card } from "./Card";

export class LoveLetterModel {
  private deckCards: Card[]; // list of constant deck cards for this game
  private players: Player[]; // list of Players in this LoveLetter Game
  private deck: Card[]; // list of remaining Cards
  private discardPile: Card[]; // list of discarded Cards
  private turn: number; // index of Player who's turn it is
  private message: string;
  private deathMessage: string;
  private numReady: number;
  private lastPlayed: Card;
  private lastBaronTarget: Player;
  private gameInProgress: boolean;

  constructor(deck: Card[]) {
    this.players = [];
    this.deck = [...deck];
    this.deckCards = [...deck];
    this.discardPile = [];
    this.message = "";
    this.deathMessage = "";
    this.numReady = 0;
    this.gameInProgress = false;
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
  public nextTurn() {
    this.message = "";
    this.deathMessage = "";

    do {
      this.turn = this.turn === this.players.length - 1 ? 0 : this.turn + 1;
    } while (this.players[this.turn].status === PlayerStatus.DEAD);
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
    this.turn = Math.floor(Math.random() * this.players.length);
    this.players[this.turn].draw(this.deck.shift());

    this.gameInProgress = true;
  }

  /**
   * Resets this love letter model for another round.
   */
  public resetRound(): void {
    this.deck = [...this.deckCards];
    this.discardPile = [];
    this.message = "";
    this.numReady = 0;
  }

  /**
   * Resets this love letter model for a new game.
   */
  public resetGame(): void {
    this.gameInProgress = false;
    this.resetRound();

    for (let p of this.players) {
      p.tokens = 0;
    }
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
    if (selected === Card.PRINCESS) {
      this.discardPile.push(currentPlayer.card);
      this.deathMessage = `☠️ ${username} played the PRINCESS and died. ☠️`;
    }

    if (
      selected === Card.GUARD ||
      selected === Card.PRIEST ||
      selected === Card.BARON ||
      selected === Card.PRINCE ||
      selected === Card.KING
    ) {
      for (let p of this.players) {
        if (p.username !== username) {
          p.status = PlayerStatus.WATCHING;
        }
      }
    }

    this.message = currentPlayer.selectCard(selected);
    this.discardPile.push(selected);
    this.lastPlayed = selected;
  }

  /**
   * In the turn stage, modifies this game when a Player executes a play action.
   * @param username  the username of the Player initiating the play
   * @param target    the username of the Player being targeted by the play
   * @param guess     the Card being guessed in the case of a Guard play
   */
  public playCard(username: string, target?: string, guess?: Card): void {
    if (
      this.lastPlayed === Card.GUARD ||
      this.lastPlayed === Card.PRIEST ||
      this.lastPlayed === Card.BARON ||
      this.lastPlayed === Card.PRINCE ||
      this.lastPlayed === Card.KING
    ) {
      for (let p of this.players) {
        if (p.username !== username) {
          p.status = PlayerStatus.WAITING;
        }
      }
    }

    let currentPlayer: Player = this.players.find(
      (player) => player.username === username
    );

    if (target) {
      let targetPlayer: Player = this.players.find(
        (player) => player.username === target
      );

      if (this.lastPlayed === Card.PRINCE) {
        if (targetPlayer.card === Card.PRINCESS) {
          targetPlayer.status = PlayerStatus.DEAD;
          targetPlayer.visibleCards = [];
          this.discardPile.push(targetPlayer.card);
          targetPlayer.card = undefined;
          this.deathMessage = `☠️ ${target} has been PRINCE'D by ${username}. ☠️`;
        } else {
          this.discardPile.push(targetPlayer.card);
          targetPlayer.card = this.deck.shift();
        }
      } else if (this.lastPlayed === Card.BARON) {
        this.lastBaronTarget = targetPlayer;
      } else if (this.lastPlayed === Card.GUARD && guess) {
        if (guess === targetPlayer.card) {
          this.discardPile.push(targetPlayer.card);
          this.deathMessage = `☠️ ${target} has been GUARD'ED by ${username} ☠️`;
        }
      }

      this.message = currentPlayer.playCard(
        this.lastPlayed,
        targetPlayer,
        guess
      );
    } else {
      currentPlayer.selfSelectable = undefined;
      currentPlayer.status = PlayerStatus.WAITING;
      currentPlayer.visibleCards = [currentPlayer.card];
    }
  }

  /**
   * In the case of a Baron or Priest play, confirms and executes the play.
   * @param username  the username of the player who confirmed the play
   */
  public confirmPlay(username: string) {
    let currentPlayer: Player = this.players.find(
      (player) => player.username === username
    );

    if (this.lastPlayed === Card.BARON && this.lastBaronTarget) {
      if (this.lastBaronTarget.card.value > currentPlayer.card.value) {
        currentPlayer.status = PlayerStatus.DEAD;
        currentPlayer.visibleCards = [];
        this.discardPile.push(currentPlayer.card);
        currentPlayer.card = undefined;
        this.lastBaronTarget.status = PlayerStatus.WAITING;
        this.lastBaronTarget.visibleCards = [this.lastBaronTarget.card];
        this.deathMessage = `☠️ ${username} tried to BARON ${this.lastBaronTarget.username} but DIED ☠️`;
      } else if (currentPlayer.card.value > this.lastBaronTarget.card.value) {
        this.lastBaronTarget.status = PlayerStatus.DEAD;
        this.lastBaronTarget.visibleCards = [];
        this.discardPile.push(this.lastBaronTarget.card);
        this.lastBaronTarget.card = undefined;
        currentPlayer.status = PlayerStatus.WAITING;
        currentPlayer.visibleCards = [currentPlayer.card];
        this.deathMessage = `☠️ ${this.lastBaronTarget.username} has been BARON'ED by ${username} ☠️`;
      } else {
        currentPlayer.visibleCards = [currentPlayer.card];
        currentPlayer.status = PlayerStatus.WAITING;
        this.lastBaronTarget.visibleCards = [this.lastBaronTarget.card];
        this.lastBaronTarget.status = PlayerStatus.WAITING;
      }
    } else if (this.lastPlayed === Card.PRIEST) {
      currentPlayer.status = PlayerStatus.WAITING;
      currentPlayer.visibleCards = [currentPlayer.card];
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
   * Removes the player with the given socket id in the case that they have disconnected.
   * @param socketId the socketId associated with this player
   */
  public removePlayer(socketId: string): void {
    let playerIndex: number = this.players.indexOf(
      this.players.find((player) => player.id === socketId)
    );
    this.players.splice(playerIndex, 1);
  }

  /**
   * Returns the current list of players in this game.
   */
  public getPlayers(): Player[] {
    return this.players;
  }

  /**
   * Returns this game's current message.
   */
  public getMessage(): string {
    return this.message;
  }

  /**
   * Returns this game's last played card.
   */
  public getLastPlayed(): Card {
    return this.lastPlayed;
  }

  /**
   * Getter for numready
   */
  public getNumReady(): number {
    return this.numReady;
  }

  /**
   * Updates this numReady by 1
   */
  public incrementNumReady(): void {
    this.numReady++;
  }

  /**
   * Resets this numReady count to 0
   */
  public resetNumReady(): void {
    this.numReady = 0;
  }

  /**
   * Returns the current death message.
   */
  public getDeathMessage(): string {
    return this.deathMessage;
  }

  /**
   * Returns whether this love letter game is currently in progress.
   */
  public getGameProgressState(): boolean {
    return this.gameInProgress;
  }

  /**
   * Determines if this love letter round has ended.
   * A love letter round ends when there are no cards left in the deck or when only one player remains.
   */
  public roundOver(): boolean {
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
      return true;
    }

    return false;
  }

  /**
   * Determines if this love letter game has ended.
   * A love letter game ends when one player has obtained 4 tokens.
   */
  public gameOver(): boolean {
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
