
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { KafkaService } from '../kafka/kafka.service';
import type { ChatMessagePayload } from '../kafka/models/chat-message.payload';
import { SocketEvents } from './events.enum';

@WebSocketGateway({
  cors: {
    origin: '*', // For development, allow all origins
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
  private onlineUsers: Map<string, string> = new Map(); // Map socket.id to userId

  constructor(private readonly kafkaService: KafkaService) {}

  afterInit() {
    this.logger.log('EventsGateway Initialized!');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.logger.log(`Client connected: ${client.id}, User ID: ${userId}`);
      client.join(userId); // Join a room named after the user's ID
      this.onlineUsers.set(client.id, userId);
      this.broadcastOnlineStatus();
    } else {
      this.logger.log(`Client connected: ${client.id} (anonymous)`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.onlineUsers.get(client.id);
    if (userId) {
      this.logger.log(`Client disconnected: ${client.id}, User ID: ${userId}`);
      this.onlineUsers.delete(client.id);
      this.broadcastOnlineStatus();
    } else {
       this.logger.log(`Client disconnected: ${client.id} (anonymous)`);
    }
  }

  private broadcastOnlineStatus() {
    const uniqueUserIds = [...new Set(this.onlineUsers.values())];
    this.server.emit(SocketEvents.SERVER_UPDATE_ONLINE_STATUS, uniqueUserIds);
  }

  @SubscribeMessage(SocketEvents.CLIENT_SEND_MESSAGE)
  async handleSendMessage(@MessageBody() payload: ChatMessagePayload): Promise<void> {
    this.logger.log(
      `Received message, producing to Kafka: ${JSON.stringify(payload)}`,
    );
    await this.kafkaService.produce('chat-messages', payload);
  }

  /**
   * Broadcasts a chat message to all clients.
   * This is typically called by the Kafka consumer.
   * @param payload - The chat message payload.
   */
  broadcastChatMessage(payload: ChatMessagePayload) {
    this.server.emit(SocketEvents.SERVER_BROADCAST_MESSAGE, payload);
    this.logger.log(
      `Broadcasted chat message: ${JSON.stringify(payload)}`,
    );
  }

  /**
   * Emits an event to a specific user.
   * @param userId - The ID of the user to send the event to.
   * @param event - The event type.
   * @param payload - The data to send.
   */
  emitToUser(userId: string, event: SocketEvents, payload: any) {
    this.server.to(userId).emit(event, payload);
    this.logger.log(`Emitted event '${event}' to user ${userId}`);
  }
}
