/**
 * The message object to be used by Socket.io events.
 */
export interface ChatMessage {
  author: string;
  message: string;
}

/**
 * Defines the structure of the live chat state.
 * - input is updated as the user is typing the message to be submitted
 * - messages[] is an array of ChatMessages received from Socket.io emits
 */
export interface ChatState {
  usernameEntered: boolean;
  username: string;
  input: string;
  messages: ChatMessage[];
  userColors: Array<String>;
  userToColorMap: Map<String, String>;
}

/**
 * Defines the possible values of a Love Letter card
 */
export interface LoveLetterCardContainerProps {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}
