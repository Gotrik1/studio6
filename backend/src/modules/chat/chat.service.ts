
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { ChatGateway } from "./chat.gateway";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly logger = new Logger(ChatService.name);
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
                text: payload.text,
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

  async findUserChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          where: {
            id: {
              not: userId,
            },
          },
          select: { id: true, name: true, avatar: true },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            author: {
              select: { name: true },
            },
          },
        },
      },
    });

    return chats.map((chat) => {
      const lastMessage = chat.messages[0];
      const otherParticipant = chat.participants[0];

      // Explicitly map fields to match the frontend `Contact` type.
      // This adapter pattern ensures consistency even if backend schemas change.
      const contactName = chat.name || otherParticipant?.name || "Unknown Chat";
      const contactAvatar =
        chat.type === "GROUP"
          ? "https://placehold.co/100x100.png"
          : otherParticipant?.avatar || "https://placehold.co/100x100.png";

      const latestMessage = lastMessage
        ? `${lastMessage.author.name}: ${lastMessage.text}`
        : "Нет сообщений";

      const latestTimestamp = lastMessage
        ? lastMessage.createdAt.toISOString()
        : chat.createdAt.toISOString();

      return {
        id: String(chat.id), // Ensure ID is a string
        teamId: chat.type === "GROUP" ? chat.id : "",
        name: contactName,
        avatar: contactAvatar,
        avatarHint: chat.type === "GROUP" ? "team logo" : "player avatar",
        lastMessage: latestMessage,
        timestamp: latestTimestamp,
        isOnline: true, // Mocked for now
        type: chat.type === "GROUP" ? ("team" as const) : ("user" as const),
      };
    });
  }

  async getHistory(chatId: string) {
    this.logger.log(`Fetching history for chat ID: ${chatId}`);
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      take: 100, // Limit to last 100 messages for performance
    });
  }
}
