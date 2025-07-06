import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { PrismaService } from "@/prisma/prisma.service";
import { ChatGateway } from "@/modules/chat/chat.gateway";

@Injectable()
export class ChatConsumer implements OnModuleInit {
  private readonly logger = new Logger(ChatConsumer.name);
  private kafka: Kafka;

  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly prisma: PrismaService,
  ) {
    this.kafka = new Kafka({
      clientId: "prodvor-chat-consumer",
      brokers: (process.env.KAFKA_BROKERS || "kafka:9092").split(","),
    });
  }

  async onModuleInit() {
    const consumer = this.kafka.consumer({ groupId: "chat-group" });

    try {
      await consumer.connect();
      await consumer.subscribe({ topic: "chat-messages", fromBeginning: true });
      this.logger.log("Kafka Consumer for chat connected and subscribed.");

      await consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;
          const payload = JSON.parse(message.value.toString());
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

          this.chatGateway.broadcastMessage(payload);
        },
      });
    } catch (error) {
      this.logger.error("Failed to connect Kafka consumer", error);
    }
  }
}
