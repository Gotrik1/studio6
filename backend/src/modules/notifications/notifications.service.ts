import { Injectable, Logger } from "@nestjs/common";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { PrismaService } from "@/prisma/prisma.service";
import { NotificationType } from "@prisma/client";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  @RabbitSubscribe({
    exchange: "prodvor_exchange",
    routingKey: "friend.request.created",
    queue: "notifications_queue",
  })
  public async handleFriendRequestCreated(msg: {
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
  }) {
    this.logger.log(`Received friend request event: ${JSON.stringify(msg)}`);

    await this.prisma.notification.create({
      data: {
        userId: msg.toUserId,
        type: NotificationType.FRIEND_REQUEST,
        message: `Игрок ${msg.fromUserName} хочет добавить вас в друзья.`,
        href: "/friends",
      },
    });
  }

  @RabbitSubscribe({
    exchange: "prodvor_exchange",
    routingKey: "match.finished",
    queue: "notifications_queue",
  })
  public async handleMatchFinished(msg: {
    matchId: string;
    team1Name: string;
    team2Name: string;
    score1: number;
    score2: number;
    participantIds: string[];
  }) {
    this.logger.log(`Received match finished event: ${JSON.stringify(msg)}`);

    const notificationsToCreate = msg.participantIds.map((userId) => ({
      userId,
      type: NotificationType.MATCH_RESULT,
      message: `Матч ${msg.team1Name} vs ${msg.team2Name} завершился со счетом ${msg.score1}-${msg.score2}.`,
      href: `/matches/${msg.matchId}`,
    }));

    await this.prisma.notification.createMany({
      data: notificationsToCreate,
    });
  }

  @RabbitSubscribe({
    exchange: "prodvor_exchange",
    routingKey: "tournament.announcement.created",
    queue: "notifications_queue",
  })
  public async handleTournamentAnnouncement(msg: {
    tournamentSlug: string;
    tournamentName: string;
    subject: string;
    participantIds: string[];
  }) {
    this.logger.log(
      `Received tournament announcement event: ${JSON.stringify(msg)}`,
    );

    const notificationsToCreate = msg.participantIds.map((userId) => ({
      userId,
      type: NotificationType.ANNOUNCEMENT,
      message: `Новое объявление в турнире "${msg.tournamentName}": ${msg.subject}`,
      href: `/tournaments/${msg.tournamentSlug}`,
    }));

    await this.prisma.notification.createMany({
      data: notificationsToCreate,
      skipDuplicates: true, // In case a user is in multiple teams
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20, // limit to last 20 notifications
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
