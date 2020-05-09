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
  input: string;
  messages: ChatMessage[];
}