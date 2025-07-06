
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

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
        team: {
          select: {
            id: true,
            logo: true,
            dataAiHint: true,
          },
        },
      },
    });

    return chats.map((chat) => {
      const lastMessage = chat.messages[0];
      const otherParticipant = chat.participants[0];

      const contactName = chat.name || otherParticipant?.name || "Unknown Chat";
      const contactAvatar =
        chat.type === "GROUP"
          ? chat.team?.logo || "https://placehold.co/100x100.png"
          : otherParticipant?.avatar || "https://placehold.co/100x100.png";

      const avatarHint =
        chat.type === "GROUP"
          ? chat.team?.dataAiHint || "team logo"
          : "player avatar";

      const latestMessage = lastMessage
        ? `${lastMessage.author.name}: ${lastMessage.content}`
        : "Нет сообщений";

      const latestTimestamp = lastMessage
        ? lastMessage.createdAt.toISOString()
        : chat.createdAt.toISOString();

      return {
        id: String(chat.id),
        teamId: chat.type === "GROUP" ? chat.team?.id || "" : "",
        name: contactName,
        avatar: contactAvatar,
        avatarHint: avatarHint,
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
