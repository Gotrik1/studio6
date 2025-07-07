import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { Playground, Prisma } from "@prisma/client";
import { CreatePlaygroundDto } from "./dto/create-playground.dto";
import { CreateReviewDto } from "./dto/create-review.dto";
import { summarizePlaygroundReviews } from "@/ai/flows/summarize-playground-reviews-flow";
import type { PlaygroundReviewSummaryDto } from "./dto/playground-review-summary.dto";

@Injectable()
export class PlaygroundsService {
  constructor(private prisma: PrismaService) {}

  private async _getKingOfTheCourt(playgroundId: string): Promise<any | null> {
    const matches = await this.prisma.match.findMany({
      where: {
        playgroundId,
        status: "FINISHED",
        team1Score: { not: null },
        team2Score: { not: null },
      },
    });

    if (matches.length === 0) return null;

    const winsCount = new Map<string, number>();

    for (const match of matches) {
      let winnerId: string | null = null;
      if (match.team1Score! > match.team2Score!) {
        winnerId = match.team1Id;
      } else if (match.team2Score! > match.team1Score!) {
        winnerId = match.team2Id;
      }
      if (winnerId) {
        winsCount.set(winnerId, (winsCount.get(winnerId) || 0) + 1);
      }
    }

    if (winsCount.size === 0) return null;

    const [topTeamId, topWins] = [...winsCount.entries()].reduce((a, b) =>
      b[1] > a[1] ? b : a,
    );

    const teamInfo = await this.prisma.team.findUnique({
      where: { id: topTeamId },
    });

    if (!teamInfo) return null;

    return { ...teamInfo, wins: topWins };
  }

  async create(
    createPlaygroundDto: CreatePlaygroundDto,
    creatorId: string,
  ): Promise<Playground> {
    return this.prisma.playground.create({
      data: {
        ...createPlaygroundDto,
        creator: { connect: { id: creatorId } },
        rating: 0, // Initial rating
        checkIns: 0, // Initial check-ins
        status: "PENDING_MODERATION",
      },
    });
  }

  async findAll(): Promise<any[]> {
    const playgrounds = await this.prisma.playground.findMany({
      where: { status: "APPROVED" },
      include: { creator: { select: { name: true, avatar: true } } },
    });

    const playgroundsWithKings = await Promise.all(
      playgrounds.map(async (p) => {
        const king = await this._getKingOfTheCourt(p.id);
        return { ...p, kingOfTheCourt: king };
      }),
    );

    return playgroundsWithKings;
  }

  async findOne(id: string): Promise<any> {
    const playground = await this.prisma.playground.findUnique({
      where: { id },
      include: {
        creator: { select: { name: true, avatar: true } },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!playground) {
      throw new NotFoundException(`Playground with ID ${id} not found`);
    }

    const kingOfTheCourt = await this._getKingOfTheCourt(id);

    return { ...playground, kingOfTheCourt };
  }

  async getKingOfTheCourt(playgroundId: string): Promise<any | null> {
    return this._getKingOfTheCourt(playgroundId);
  }

  async getPlaygroundLeaderboard(playgroundId: string): Promise<any[]> {
    const checkIns = await this.prisma.activity.groupBy({
      by: ["userId"],
      where: {
        playgroundId,
        type: "PLAYGROUND_CHECK_IN",
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 10,
    });

    if (checkIns.length === 0) {
      return [];
    }

    const userIds = checkIns.map((c) => c.userId);
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    const usersMap = new Map(users.map((u) => [u.id, u]));

    return checkIns.map((checkIn, index) => {
      const user = usersMap.get(checkIn.userId);
      return {
        id: user?.id || checkIn.userId,
        rank: index + 1,
        name: user?.name || "Неизвестный игрок",
        avatar: user?.avatar || null,
        checkIns: checkIn._count.userId,
      };
    });
  }

  async findAllForAdmin(): Promise<Playground[]> {
    return this.prisma.playground.findMany({
      include: { creator: { select: { name: true, avatar: true } } },
    });
  }

  async approve(id: string): Promise<Playground> {
    return this.prisma.playground.update({
      where: { id },
      data: { status: "APPROVED" },
    });
  }

  async remove(id: string): Promise<Playground> {
    return this.prisma.playground.delete({ where: { id } });
  }

  async addReview(playgroundId: string, userId: string, dto: CreateReviewDto) {
    const playground = await this.prisma.playground.findUnique({
      where: { id: playgroundId },
    });
    if (!playground) {
      throw new NotFoundException(
        `Playground with ID ${playgroundId} not found`,
      );
    }

    return this.prisma.playgroundReview.create({
      data: {
        ...dto,
        playground: { connect: { id: playgroundId } },
        author: { connect: { id: userId } },
      },
    });
  }

  async findReviews(playgroundId: string) {
    return this.prisma.playgroundReview.findMany({
      where: { playgroundId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async getReviewSummary(
    playgroundId: string,
  ): Promise<PlaygroundReviewSummaryDto> {
    const reviews = await this.prisma.playgroundReview.findMany({
      where: { playgroundId },
      select: { comment: true, rating: true },
    });

    if (reviews.length === 0) {
      return {
        pros: [],
        cons: [],
        averageRating: 0,
      };
    }

    const reviewTexts = reviews.map((r) => r.comment);
    const summary = await summarizePlaygroundReviews({ reviews: reviewTexts });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      ...summary,
      averageRating: parseFloat(averageRating.toFixed(1)),
    };
  }

  async findSchedule(playgroundId: string): Promise<any[]> {
    const now = new Date();
    const lobbies = await this.prisma.lfgLobby.findMany({
      where: {
        playgroundId,
        endTime: { gt: now },
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        _count: { select: { players: true } },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return lobbies.map((lobby) => ({
      id: lobby.id,
      type: lobby.type,
      sport: lobby.sport,
      location: lobby.location,
      playgroundId: lobby.playgroundId,
      startTime: lobby.startTime,
      endTime: lobby.endTime,
      playersNeeded: lobby.playersNeeded,
      playersJoined: lobby._count.players,
      comment: lobby.comment,
      creator: {
        name: lobby.creator.name,
        avatar: lobby.creator.avatar,
      },
    }));
  }
}
