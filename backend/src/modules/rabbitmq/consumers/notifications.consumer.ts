import { Injectable, Logger } from "@nestjs/common";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import { PRODVOR_EXCHANGE } from "../rabbitmq.config";
import type { FriendRequestCreatedPayload } from "../models/friend-request-created.payload";
import type { MatchFinishedPayload } from "../models/match-finished.payload";
import type { TournamentAnnouncementCreatedPayload } from "../models/tournament-announcement-created.payload";

/**
 * Этот класс отвечает за прослушивание всех событий из RabbitMQ
 * и вызов соответствующих сервисов для создания уведомлений.
 */
@Injectable()
export class NotificationsConsumer {
  private readonly logger = new Logger(NotificationsConsumer.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @RabbitSubscribe({
    exchange: PRODVOR_EXCHANGE,
    routingKey: "friend.request.created",
    queue: "notifications_queue",
  })
  public async handleFriendRequestCreated(payload: FriendRequestCreatedPayload) {
    this.logger.log(`Received friend request event: ${JSON.stringify(payload)}`);
    await this.notificationsService.createFriendRequestNotification(payload);
  }

  @RabbitSubscribe({
    exchange: PRODVOR_EXCHANGE,
    routingKey: "match.finished",
    queue: "notifications_queue",
  })
  public async handleMatchFinished(payload: MatchFinishedPayload) {
    this.logger.log(`Received match finished event: ${JSON.stringify(payload)}`);
    await this.notificationsService.createMatchFinishedNotification(payload);
  }

  @RabbitSubscribe({
    exchange: PRODVOR_EXCHANGE,
    routingKey: "tournament.announcement.created",
    queue: "notifications_queue",
  })
  public async handleTournamentAnnouncement(
    payload: TournamentAnnouncementCreatedPayload,
  ) {
    this.logger.log(
      `Received tournament announcement event: ${JSON.stringify(payload)}`,
    );
    await this.notificationsService.createTournamentAnnouncementNotification(
      payload,
    );
  }
}
