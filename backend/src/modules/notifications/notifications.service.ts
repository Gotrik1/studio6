import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  @RabbitSubscribe({
    exchange: 'prodvor_exchange',
    routingKey: 'friend.request.created',
    queue: 'notifications_queue',
  })
  public async handleFriendRequestCreated(msg: { fromUserId: string; fromUserName: string; toUserId: string }) {
    this.logger.log(`Received friend request event: ${JSON.stringify(msg)}`);
    
    await this.prisma.notification.create({
        data: {
            userId: msg.toUserId,
            type: 'FRIEND_REQUEST',
            message: `Игрок ${msg.fromUserName} хочет добавить вас в друзья.`,
            href: '/friends',
        }
    });
  }

  async getNotifications(userId: string) {
      return this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
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
