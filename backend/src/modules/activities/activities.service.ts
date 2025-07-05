import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async getFeed() {
    return this.prisma.activity.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async createStatusPost(userId: string, text: string) {
    return this.prisma.activity.create({
      data: {
        type: ActivityType.STATUS_POSTED,
        userId,
        metadata: {
          text,
        },
      },
    });
  }
}
