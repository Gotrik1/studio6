import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { EventsGateway } from "@/modules/websockets";
import { kafka } from "../kafka.config";
import type { ChatMessagePayload } from "../models/chat-message.payload";

@Injectable()
export class ChatConsumer implements OnModuleInit {
  private readonly logger = new Logger(ChatConsumer.name);

  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const consumer = kafka.consumer({ groupId: "chat-group" });

    try {
      await consumer.connect();
      await consumer.subscribe({ topic: "chat-messages", fromBeginning: true });
      this.logger.log("Kafka Consumer for chat connected and subscribed.");

      await consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;
          const payload = JSON.parse(
            message.value.toString(),
          ) as ChatMessagePayload;
          this.logger.log(
            `Received message from Kafka: ${JSON.stringify(payload)}`,
          );

          // Persist the message to the database
          if (payload.text && payload.chatId && payload.sender?.id) {
            await this.prisma.message.create({
              data: {
                content: payload.text,
                chatId: payload.chatId,
                authorId: payload.sender.id,
              },
            });
          } else {
            this.logger.warn(
              "Received invalid message payload from Kafka, skipping DB insert",
              payload,
            );
          }

          this.eventsGateway.broadcastChatMessage(payload);
        },
      });
    } catch (error) {
      this.logger.error("Failed to connect Kafka consumer", error);
    }
  }
}
