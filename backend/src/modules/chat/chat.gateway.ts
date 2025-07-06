
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { KafkaService } from "../kafka/kafka.service";

@WebSocketGateway({
  cors: {
    origin: "*", // For development, allow all origins
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("ChatGateway");

  constructor(private readonly kafkaService: KafkaService) {}

  afterInit() {
    this.logger.log("ChatGateway Initialized!");
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("sendMessage")
  async handleMessage(client: Socket, payload: any): Promise<void> {
    this.logger.log(
      `Received message from client ${client.id}, producing to Kafka...`,
    );
    await this.kafkaService.produce("chat-messages", payload);
  }

  broadcastMessage(payload: any) {
    this.server.emit("receiveMessage", payload);
    this.logger.log(
      `Broadcasted message to all clients: ${JSON.stringify(payload)}`,
    );
  }
}
