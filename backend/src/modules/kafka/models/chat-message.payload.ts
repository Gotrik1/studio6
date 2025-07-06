/**
 * @fileOverview Defines the data structure for a chat message payload sent via Kafka.
 */

export interface ChatMessagePayload {
  chatId: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
}
