
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateMatchDto } from "./dto/create-match.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Match, MatchStatus, Prisma, MatchEventType } from "@prisma/client";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ResolveDisputeDto } from "./dto/resolve-dispute.dto";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { PRODVOR_EXCHANGE } from "../rabbitmq/rabbitmq.config";
import type { MatchFinishedPayload } from "../rabbitmq/models/match-finished.payload";

type ShapedMatchForList = {
  id: string;
  team1: { id: string; name: string; logo: string; logoHint: string };
  team2: { id: string; name: string; logo: string; logoHint: string };
  score: string;
  tournament: string;
  game: string;
  date: string;
  href: string;
  status: string; // Changed from MatchStatus to string
  [key: string]: unknown; // Allow other properties from original match
};

type MatchDetailsForFrontend = {
  id: string;
  tournament: string;
  status: string;
  score: string;
  date: string;
  time: string;
  location: string;
  referee: { name: string };
  team1: {
    id: string;
    name: string;
    logo: string;
    logoHint: string;
    slug: string;
    members: { id: string; name: string; role: string; avatar: string | null }[];
  };
  team2: {
    id: string;
    name: string;
    logo: string;
    logoHint: string;
    slug: string;
    members: { id: string; name: string; role: string; avatar: string | null }[];
  };
  lineups: {
    team1: { name: string; role: string; avatar: string; avatarHint: string }[];
    team2: { name: string; role: string; avatar: string; avatarHint: string }[];
  };
  events: {
    time: string;
    event: MatchEventType;
    player: string;
    team: string;
  }[];
  teamStats: {
    [key: string]: { label: string; team1: number; team2: number };
  } | null;
  media: ({
    id: string;
    type: string;
    src: string;
    description: string | null;
    hint: string | null;
    createdAt: Date;
    tournamentId: string;
  })[];
  bracket: {
    rounds: unknown[];
  };
};

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const {
      team1Id,
      team2Id,
      tournamentId,
      scheduledAt,
      playgroundId,
      location,
    } = createMatchDto;
    return this.prisma.match.create({
      data: {
        team1: { connect: { id: team1Id } },
        team2: { connect: { id: team2Id } },
        tournament: tournamentId
          ? { connect: { id: tournamentId } }
          : undefined,
        scheduledAt,
        status: "PLANNED",
        playgroundId,
        location,
      },
    });
  }

  async findAll(params?: {
    status?: MatchStatus;
    tournamentId?: string;
    teamId?: string;
  }): Promise<ShapedMatchForList[]> {
    const where: Prisma.MatchWhereInput = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.tournamentId) {
      where.tournamentId = params.tournamentId;
    }
    if (params?.teamId) {
      where.OR = [{ team1Id: params.teamId }, { team2Id: params.teamId }];
    }

    const matches = await this.prisma.match.findMany({
      where,
      include: {
        team1: {
          select: {
            id: true,
            name: true,
            logo: true,
            dataAiHint: true,
            slug: true,
          },
        },
        team2: {
          select: {
            id: true,
            name: true,
            logo: true,
            dataAiHint: true,
            slug: true,
          },
        },
        tournament: { select: { name: true, game: true } },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    const statusMap: Record<MatchStatus, string> = {
      PLANNED: "Предстоящий",
      LIVE: "Идет",
      FINISHED: "Завершен",
      DISPUTED: "Спорный",
      CANCELLED: "Отменен",
    };

    return matches.map((match): ShapedMatchForList => ({
      ...match,
      team1: {
        id: match.team1.id,
        name: match.team1.name,
        logo: match.team1.logo || "https://placehold.co/100x100.png",
        logoHint: match.team1.dataAiHint || "team logo",
      },
      team2: {
        id: match.team2.id,
        name: match.team2.name,
        logo: match.team2.logo || "https://placehold.co/100x100.png",
        logoHint: match.team2.dataAiHint || "team logo",
      },
      score:
        match.team1Score !== null && match.team2Score !== null
          ? `${match.team1Score}-${match.team2Score}`
          : "VS",
      tournament: match.tournament?.name || "Товарищеский матч",
      game: match.tournament?.game || "Неизвестно",
      date: format(new Date(match.scheduledAt), "yyyy-MM-dd"),
      status: statusMap[match.status],
      href: `/matches/${match.id}`,
    }));
  }

  async findOne(id: string): Promise<MatchDetailsForFrontend | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        team1: {
          include: {
            members: {
              select: { id: true, name: true, role: true, avatar: true },
            },
          },
        },
        team2: {
          include: {
            members: {
              select: { id: true, name: true, role: true, avatar: true },
            },
          },
        },
        tournament: {
          include: {
            media: true,
          },
        },
        events: {
          include: {
            player: { select: { name: true } },
            team: { select: { name: true } },
          },
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    const shapedEvents = match.events.map((event) => ({
      time: format(new Date(event.timestamp), "mm:ss"), // Format for minutes and seconds in a match
      event: event.type,
      player: event.player?.name || "N/A",
      team: event.team?.name || "N/A",
    }));

    const teamStats: {
      [key: string]: { label: string; team1: number; team2: number };
    } = {
      shots: { label: "Удары по воротам", team1: 0, team2: 0 },
      shotsOnTarget: { label: "Удары в створ", team1: 0, team2: 0 },
      corners: { label: "Угловые", team1: 0, team2: 0 },
      fouls: { label: "Нарушения", team1: 0, team2: 0 },
      yellowCards: { label: "Желтые карточки", team1: 0, team2: 0 },
      redCards: { label: "Красные карточки", team1: 0, team2: 0 },
    };

    // In a real application, possession would be derived from a more complex event stream.
    // For this demo, we can mock it to ensure the UI looks complete.
    teamStats["possession"] = {
      label: "Владение мячом",
      team1: 55,
      team2: 45,
    };

    for (const event of match.events) {
      const teamKey = event.teamId === match.team1Id ? "team1" : "team2";
      switch (event.type) {
        case "SHOT":
          teamStats.shots[teamKey]++;
          break;
        case "SHOT_ON_TARGET":
          // A shot on target is also a shot
          teamStats.shots[teamKey]++;
          teamStats.shotsOnTarget[teamKey]++;
          break;
        case "CORNER":
          teamStats.corners[teamKey]++;
          break;
        case "FOUL":
          teamStats.fouls[teamKey]++;
          break;
        case "YELLOW_CARD":
          teamStats.yellowCards[teamKey]++;
          break;
        case "RED_CARD":
          teamStats.redCards[teamKey]++;
          break;
      }
    }

    // Map Prisma result to the frontend's MatchDetails shape
    return {
      id: match.id,
      tournament: match.tournament?.name || "Товарищеский матч",
      status:
        match.status === "FINISHED"
          ? "Завершен"
          : match.status === "PLANNED"
            ? "Запланирован"
            : "Идет",
      score:
        match.team1Score !== null && match.team2Score !== null
          ? `${match.team1Score}-${match.team2Score}`
          : "VS",
      date: format(new Date(match.scheduledAt), "d MMMM yyyy", { locale: ru }),
      time: format(new Date(match.scheduledAt), "HH:mm"),
      location: match.location || "Место не указано",
      referee: { name: match.refereeName || "Судья не назначен" },
      team1: {
        ...match.team1,
        logo: match.team1.logo || "https://placehold.co/100x100.png",
        logoHint: match.team1.dataAiHint || "team logo",
      },
      team2: {
        ...match.team2,
        logo: match.team2.logo || "https://placehold.co/100x100.png",
        logoHint: match.team2.dataAiHint || "team logo",
      },
      lineups: {
        team1: match.team1.members.map((m) => ({
          name: m.name,
          role: m.role,
          avatar: m.avatar || "https://placehold.co/40x40.png",
          avatarHint: "sports player",
        })),
        team2: match.team2.members.map((m) => ({
          name: m.name,
          role: m.role,
          avatar: m.avatar || "https://placehold.co/40x40.png",
          avatarHint: "sports player",
        })),
      },
      events: shapedEvents,
      teamStats,
      media: match.tournament?.media || [],
      bracket: {
        rounds: [], // This should be calculated based on all tournament matches
      },
    };
  }

  async findMatchOfTheWeek(): Promise<Match | null> {
    const recentFinishedMatches = await this.prisma.match.findMany({
      where: {
        status: "FINISHED",
        team1Score: { not: null },
        team2Score: { not: null },
      },
      orderBy: { finishedAt: "desc" },
      take: 10,
      include: {
        team1: true,
        team2: true,
        tournament: true,
      },
    });

    if (recentFinishedMatches.length === 0) {
      return null;
    }

    // Find the match with the closest score
    const sortedByDiff = recentFinishedMatches.sort(
      (a, b) =>
        Math.abs((a.team1Score || 0) - (a.team2Score || 0)) -
        Math.abs((b.team1Score || 0) - (b.team2Score || 0)),
    );

    return sortedByDiff[0];
  }

  async updateScore(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const { score1, score2 } = updateMatchDto;
    // Basic validation
    if (score1 === undefined || score2 === undefined) {
      throw new BadRequestException("Необходимо указать счет обеих команд.");
    }

    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        team1: { include: { members: { select: { id: true } } } },
        team2: { include: { members: { select: { id: true } } } },
      },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    const updatedMatch = await this.prisma.match.update({
      where: { id },
      data: {
        team1Score: score1,
        team2Score: score2,
        status: "FINISHED",
        finishedAt: new Date(),
      },
    });

    const participantIds = [
      ...new Set([
        ...match.team1.members.map((m) => m.id),
        ...match.team2.members.map((m) => m.id),
      ]),
    ];

    const payload: MatchFinishedPayload = {
      matchId: updatedMatch.id,
      team1Name: match.team1.name,
      team2Name: match.team2.name,
      score1: updatedMatch.team1Score!,
      score2: updatedMatch.team2Score!,
      participantIds,
    };

    this.amqpConnection.publish(PRODVOR_EXCHANGE, "match.finished", payload);

    return updatedMatch;
  }

  async resolveDispute(
    matchId: string,
    dto: ResolveDisputeDto,
  ): Promise<Match> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { team1: true, team2: true },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${matchId} не найден.`);
    }

    if (match.status !== "DISPUTED") {
      throw new BadRequestException("Этот матч не является спорным.");
    }

    if (dto.winnerId !== match.team1Id && dto.winnerId !== match.team2Id) {
      throw new BadRequestException(
        "Победитель должен быть одной из команд матча.",
      );
    }

    const loserId =
      dto.winnerId === match.team1Id ? match.team2Id : match.team1Id;

    return this.prisma.$transaction(async (tx) => {
      // Update match
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: {
          status: "FINISHED",
          team1Score: dto.score1,
          team2Score: dto.score2,
          resolution: dto.resolution,
          finishedAt: new Date(),
        },
      });

      // Update winner stats
      await tx.team.update({
        where: { id: dto.winnerId },
        data: { wins: { increment: 1 } },
      });

      // Update loser stats
      await tx.team.update({
        where: { id: loserId },
        data: { losses: { increment: 1 } },
      });

      return updatedMatch;
    });
  }

  async remove(id: string): Promise<Match> {
    return this.prisma.match.delete({ where: { id } });
  }
}
