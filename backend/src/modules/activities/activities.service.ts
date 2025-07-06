
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { ActivityType } from "@prisma/client";
import { CreateCheckInDto } from "./dto/create-check-in.dto";

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async getPlaygroundFeed(playgroundId: string) {
    return this.prisma.activity.findMany({
      where: {
        playgroundId,
        type: "PLAYGROUND_CHECK_IN",
      },
      orderBy: {
        createdAt: "desc",
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

  async createCheckInActivity(userId: string, data: CreateCheckInDto) {
    // Use a transaction to ensure both the activity is created and the check-in count is updated
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the activity
      const activity = await tx.activity.create({
        data: {
          type: ActivityType.PLAYGROUND_CHECK_IN,
          userId,
          playgroundId: data.playgroundId,
          metadata: {
            comment: data.comment,
            photo: data.photo, // This would be a URL in a real app after upload
          },
        },
      });

      // 2. Update the playground's check-in count
      await tx.playground.update({
        where: { id: data.playgroundId },
        data: {
          checkIns: {
            increment: 1,
          },
        },
      });

      return activity;
    });
  }
}
