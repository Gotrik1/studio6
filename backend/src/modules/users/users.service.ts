
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { User, Prisma, TrainingLogStatus } from "@prisma/client";
import { differenceInYears, format, formatDistanceToNow } from "date-fns";
import { LeaderboardPlayerDto } from "./dto/leaderboard-player.dto";
import { PlayerStatsDto } from "./dto/player-stats.dto";
import type {
  UserTeam,
  TournamentCrm,
  JudgedMatch,
  CoachedPlayer,
} from "@/entities/user/model/types";
import { ru } from "date-fns/locale";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, role, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    // NOTE: In a Keycloak architecture, the user would be created via Keycloak Admin API.
    // This is a simplified version for the prototype.
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password || "mock_hash", // In a real app, hash the password
        role: role || "PLAYER",
        status: "Активен",
        xp: 0,
      },
    });

    return user;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findAll(params?: { role?: string }): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};
    if (params?.role) {
      where.role = params.role as any;
    }
    return this.prisma.user.findMany({ where });
  }

  async findOne(id: string): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        teamsAsMember: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
        organizedTournaments: {
          include: {
            _count: {
              select: { teams: true },
            },
          },
        },
        organizedPromotions: {
          include: {
            sponsor: { select: { name: true, logo: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        careerHistory: {
          orderBy: { createdAt: "asc" },
        },
        coaching: {
          // Fetch players this coach is coaching
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            mainSport: true,
            trainingLogs: {
              select: {
                status: true,
              },
            },
          },
        },
        judgedMatches: {
          include: {
            team1: { select: { name: true } },
            team2: { select: { name: true } },
          },
          orderBy: { finishedAt: "desc" },
          take: 20,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const userTeams: UserTeam[] = user.teamsAsMember.map((team) => ({
      id: team.id,
      name: team.name,
      role: user.id === team.captainId ? "Капитан" : "Участник",
      logo: team.logo,
      dataAiHint: team.dataAiHint,
      slug: team.slug,
      rank: team.rank,
      game: team.game,
    }));

    const organizedTournaments: TournamentCrm[] = user.organizedTournaments.map(
      (t) => ({
        id: t.id,
        name: t.name,
        sport: t.game,
        status: t.status,
        participants: t._count.teams,
        maxParticipants: t.participantCount,
        startDate: t.tournamentStartDate.toISOString(),
        organizer: user.name,
        rules: t.rules || "",
      }),
    );

    const judgedMatches: JudgedMatch[] = user.judgedMatches.map((m) => ({
      id: m.id,
      team1: { name: m.team1.name },
      team2: { name: m.team2.name },
      resolution: `Счет ${m.team1Score}-${m.team2Score}`,
      timestamp: m.finishedAt?.toISOString() || null,
    }));

    const coachedPlayers: CoachedPlayer[] = (user.coaching || []).map(
      (player: any) => {
        const completed = player.trainingLogs.filter(
          (log: any) => log.status === TrainingLogStatus.COMPLETED,
        ).length;
        const skipped = player.trainingLogs.filter(
          (log: any) => log.status === TrainingLogStatus.SKIPPED,
        ).length;
        const totalRelevant = completed + skipped;
        const adherence =
          totalRelevant > 0
            ? Math.round((completed / totalRelevant) * 100)
            : 100;

        return {
          id: String(player.id),
          name: player.name,
          avatar: player.avatar || null,
          role: player.role,
          stats: { kda: "1.25", winRate: "55%", favoriteMap: "Ascent" }, // mock
          matchHistory: "W-L-W-W-L", // mock
          adherence,
        };
      },
    );

    const dateOfBirth = user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : null;

    const augmentedProfile = {
      ...user,
      teams: userTeams,
      organizedTournaments,
      judgedMatches,
      coaching: coachedPlayers,
      dateOfBirth: dateOfBirth,
      age: user.dateOfBirth
        ? differenceInYears(new Date(), new Date(user.dateOfBirth))
        : null,
      location: user.location,
      mainSport: user.mainSport,
      isVerified: user.isVerified,
      preferredSports: user.preferredSports,
      contacts: {
        telegram: user.telegram,
        discord: user.discord,
      },
      activitySummary: `Пользователь с ${format(
        user.createdAt,
        "yyyy",
      )} года. Последняя активность: ${formatDistanceToNow(user.updatedAt, {
        addSuffix: true,
        locale: ru,
      })}.`, // Generated summary
      statsSummary: `Играет в ${user.mainSport || "неизвестно"}, роль - ${
        user.role
      }.`, // Generated summary
      profileUrl: `/profiles/player/${user.id}`,
    };

    return augmentedProfile;
  }

  async getLeaderboard(): Promise<LeaderboardPlayerDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        xp: "desc",
      },
      take: 10,
    });

    return users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.xp,
      avatar: user.avatar || "https://placehold.co/40x40.png",
      avatarHint: "player avatar",
    }));
  }

  async getStatsForUser(userId: string): Promise<PlayerStatsDto> {
    const userWithTeams = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { teamsAsMember: { select: { id: true } } },
    });

    if (!userWithTeams || userWithTeams.teamsAsMember.length === 0) {
      // Return default/empty stats if user has no teams
      return {
        winLossData: { wins: 0, losses: 0 },
        kdaByMonthData: [],
        winrateByMapData: [],
        summary: { matches: 0, winrate: 0, winStreak: 0, kda: 0 },
      };
    }

    const teamIds = userWithTeams.teamsAsMember.map((t) => t.id);

    const matches = await this.prisma.match.findMany({
      where: {
        status: "FINISHED",
        OR: [{ team1Id: { in: teamIds } }, { team2Id: { in: teamIds } }],
      },
      orderBy: { finishedAt: "desc" },
    });

    let wins = 0;
    let losses = 0;
    let winStreak = 0;
    let streakBroken = false;

    for (const match of matches) {
      if (match.team1Score === null || match.team2Score === null) continue;

      const isTeam1 = teamIds.includes(match.team1Id);

      const userTeamScore = isTeam1 ? match.team1Score : match.team2Score;
      const opponentScore = isTeam1 ? match.team2Score : match.team1Score;

      if (userTeamScore > opponentScore) {
        wins++;
        if (!streakBroken) {
          winStreak++;
        }
      } else if (userTeamScore < opponentScore) {
        losses++;
        streakBroken = true;
      }
    }

    const totalMatches = wins + losses;
    const winrate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    // KDA and Map data are not in our schema, so we return empty arrays.
    // The frontend should handle this gracefully.
    return {
      winLossData: { wins, losses },
      kdaByMonthData: [],
      winrateByMapData: [],
      summary: {
        matches: totalMatches,
        winrate: parseFloat(winrate.toFixed(1)),
        winStreak,
        kda: 0, // KDA is not tracked
      },
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
