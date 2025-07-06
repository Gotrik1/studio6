import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { NotificationType } from "@prisma/client";
import type { FriendRequestCreatedPayload } from "../rabbitmq/models/friend-request-created.payload";
import type { MatchFinishedPayload } from "../rabbitmq/models/match-finished.payload";
import type { TournamentAnnouncementCreatedPayload } from "../rabbitmq/models/tournament-announcement-created.payload";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createFriendRequestNotification(payload: FriendRequestCreatedPayload) {
    await this.prisma.notification.create({
      data: {
        userId: payload.toUserId,
        type: NotificationType.FRIEND_REQUEST,
        message: `Игрок ${payload.fromUserName} хочет добавить вас в друзья.`,
        href: "/friends",
      },
    });
  }

  async createMatchFinishedNotification(payload: MatchFinishedPayload) {
    const notificationsToCreate = payload.participantIds.map((userId) => ({
      userId,
      type: NotificationType.MATCH_RESULT,
      message: `Матч ${payload.team1Name} vs ${payload.team2Name} завершился со счетом ${payload.score1}-${payload.score2}.`,
      href: `/matches/${payload.matchId}`,
    }));

    await this.prisma.notification.createMany({
      data: notificationsToCreate,
    });
  }

  async createTournamentAnnouncementNotification(
    payload: TournamentAnnouncementCreatedPayload,
  ) {
    const notificationsToCreate = payload.participantIds.map((userId) => ({
      userId,
      type: NotificationType.ANNOUNCEMENT,
      message: `Новое объявление в турнире "${payload.tournamentName}": ${payload.subject}`,
      href: `/tournaments/${payload.tournamentSlug}`,
    }));

    await this.prisma.notification.createMany({
      data: notificationsToCreate,
      skipDuplicates: true,
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
