import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
  ForbiddenException,
} from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Team, ActivityType, Prisma, TrainingLogStatus, Match as PrismaMatch, Role } from "@prisma/client";
import { LeaderboardTeamDto } from "./dto/leaderboard-team.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CreatePracticeDto } from "./dto/create-practice.dto";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { analyzeTeamPerformance } from "@/ai/flows/analyze-team-performance-flow";
import { UsersService } from "../users/users.service";
import { generateLeaderboardCacheKey, generateTeamCacheKey } from "../cache/cache.utils";

// Define a precise type for the match object with its relations
type MatchWithRelations = PrismaMatch & {
  team1: {
    id: string;
    name: string;
    logo: string | null;
    dataAiHint: string | null;
  };
  team2: {
    id: string;
    name: string;
    logo: string | null;
    dataAiHint: string | null;
  };
  tournament: {
    name: string;
    game: string;
  } | null;
};


@Injectable()
export class TeamsService implements OnModuleInit {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.seedTeams();
  }

  async seedTeams() {
    const teamCount = await this.prisma.team.count();
    if (teamCount > 0) return;

    this.logger.log("Seeding initial teams...");

    // Ensure a user exists to be a captain
    let captain = await this.prisma.user.findFirst();
    if (!captain) {
      captain = await this.prisma.user.create({
        data: {
          email: "captain@example.com",
          name: "Captain Seed",
          passwordHash: "seeded",
          role: Role.CAPTAIN,
        },
      });
    }

    const teamsToCreate = [
      {
        name: "Дворовые Атлеты",
        game: "Футбол",
        motto: "Играем сердцем",
        slug: "dvotovyie-atlety",
      },
      {
        name: "Соколы",
        game: "Футбол",
        motto: "Выше только небо",
        slug: "sokoly",
      },
      {
        name: "Торпедо",
        game: "Футбол",
        motto: "Только вперед",
        slug: "torpedo",
      },
      {
        name: "Вымпел",
        game: "Футбол",
        motto: "Сила в единстве",
        slug: "vympel",
      },
    ];

    for (const teamData of teamsToCreate) {
      // Need a unique captain for each team
      const teamCaptain = await this.prisma.user.create({
        data: {
          email: `${teamData.slug}@example.com`,
          name: `Captain ${teamData.name}`,
          passwordHash: "seeded",
          role: Role.CAPTAIN,
        },
      });

      await this.prisma.team.create({
        data: {
          ...teamData,
          creatorId: teamCaptain.id,
          captainId: teamCaptain.id,
        },
      });
    }
    this.logger.log("Initial teams seeded.");
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name, captainId, game, motto, logo, dataAiHint } = createTeamDto;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const team = await this.prisma.team.create({
      data: {
        name,
        slug,
        game,
        motto,
        logo,
        dataAiHint,
        captain: {
          connect: { id: captainId },
        },
        creator: {
          connect: { id: captainId },
        },
        members: {
          connect: { id: captainId },
        },
      },
    });

    const cacheKey = generateLeaderboardCacheKey();
    const gameCacheKey = generateLeaderboardCacheKey(game);
    await this.cacheManager.del(cacheKey);
    await this.cacheManager.del(gameCacheKey);

    return team;
  }

  async findAll(): Promise<any[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        captain: {
          select: { name: true },
        },
        _count: {
          select: { members: true },
        },
      },
    });

    // Map Prisma result to the shape expected by the frontend
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      motto: team.motto || "Девиз не указан",
      logo: team.logo || "https://placehold.co/100x100.png",
      dataAiHint: team.dataAiHint || "team logo",
      game: team.game,
      rank: team.rank,
      members: team._count.members,
      captain: team.captain.name,
      slug: team.slug,
      homePlaygroundId: team.homePlaygroundId,
    }));
  }

  async findOne(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id },
      include: { captain: true, members: true, tournaments: true },
    });
  }

  async findBySlug(slug: string): Promise<any | null> {
    const cacheKey = generateTeamCacheKey(slug);
    const cachedTeam = await this.cacheManager.get<any>(cacheKey);

    if (cachedTeam) {
      this.logger.log(`Cache hit for team slug: ${slug}`);
      return cachedTeam;
    }
     this.logger.log(`Cache miss for team slug: ${slug}`);

    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: {
        captain: {
          select: { name: true },
        },
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            status: true,
            trainingLogs: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Команда со слагом "${slug}" не найдена`);
    }

    const roster = team.members.map((member) => {
      const completed = member.trainingLogs.filter(
        (log) => log.status === TrainingLogStatus.COMPLETED,
      ).length;
      const skipped = member.trainingLogs.filter(
        (log) => log.status === TrainingLogStatus.SKIPPED,
      ).length;
      const totalRelevant = completed + skipped;
      const adherence =
        totalRelevant > 0 ? Math.round((completed / totalRelevant) * 100) : 100;

      return {
        id: member.id,
        name: member.name,
        avatar: member.avatar || "https://placehold.co/100x100.png",
        role: member.role,
        rating: "Immortal", // This can stay as mock for now, as ELO/Rating is not in the schema yet.
        status: member.status,
        adherence,
      };
    });

    const result = {
      id: team.id,
      name: team.name,
      motto: team.motto || "Девиз не указан",
      logo: team.logo || "https://placehold.co/100x100.png",
      dataAiHint: team.dataAiHint || "team logo",
      game: team.game,
      rank: team.rank,
      wins: team.wins,
      losses: team.losses,
      draws: team.draws,
      membersCount: team.members.length,
      captainId: team.captainId,
      slug: team.slug,
      homePlaygroundId: team.homePlaygroundId,
      roster,
    };

    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async getLeaderboard(params?: {
    game?: string;
  }): Promise<LeaderboardTeamDto[]> {
    const cacheKey = generateLeaderboardCacheKey(params?.game);
    const cachedLeaderboard =
      await this.cacheManager.get<LeaderboardTeamDto[]>(cacheKey);

    if (cachedLeaderboard) {
      this.logger.log(`Cache hit for leaderboard: ${cacheKey}`);
      return cachedLeaderboard;
    }
    this.logger.log(`Cache miss for leaderboard: ${cacheKey}`);


    const whereClause = params?.game
      ? Prisma.sql`WHERE game = ${params.game}`
      : Prisma.empty;

    const result: LeaderboardTeamDto[] = await this.prisma.$queryRaw`
        SELECT
            id,
            name,
            logo,
            "dataAiHint",
            game,
            rank,
            wins,
            losses,
            draws,
            slug
        FROM "Team"
        ${whereClause}
        ORDER BY wins DESC, losses ASC
        LIMIT 10
    `;

    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async joinTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { where: { id: userId } } },
    });

    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    if (team.members.length > 0) {
      throw new BadRequestException(
        "Вы уже являетесь участником этой команды.",
      );
    }
    
    await this.cacheManager.del(generateTeamCacheKey(team.slug));

    await this.prisma.activity.create({
      data: {
        type: ActivityType.TEAM_JOINED,
        userId: userId,
        metadata: {
          teamName: team.name,
          teamHref: `/teams/${team.slug}`,
          icon: "Users",
        },
      },
    });

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
      include: { members: true },
    });
  }

  async setHomePlayground(
    teamId: string,
    playgroundId: string,
    captainId: string,
  ): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    if (team.captainId !== captainId) {
      throw new ForbiddenException(
        "Только капитан может изменить домашнюю площадку.",
      );
    }

    const updatedTeam = await this.prisma.team.update({
      where: { id: teamId },
      data: { homePlaygroundId: playgroundId },
    });

    // Invalidate cache
    await this.cacheManager.del(generateTeamCacheKey(team.slug));

    return updatedTeam;
  }

  async removeMember(
    teamId: string,
    memberIdToRemove: string,
    captainId: string,
  ): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    if (team.captainId !== captainId) {
      throw new ForbiddenException("Только капитан может удалять участников.");
    }

    if (memberIdToRemove === captainId) {
      throw new BadRequestException("Капитан не может удалить самого себя.");
    }

    await this.cacheManager.del(generateTeamCacheKey(team.slug));

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          disconnect: { id: memberIdToRemove },
        },
      },
    });
  }

  async setCaptain(
    teamId: string,
    newCaptainId: string,
    currentCaptainId: string,
  ): Promise<Team> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    if (team.captainId !== currentCaptainId) {
      throw new ForbiddenException(
        "Только текущий капитан может передать полномочия.",
      );
    }

    if (newCaptainId === currentCaptainId) {
      throw new BadRequestException(
        "Этот пользователь уже является капитаном.",
      );
    }

    const isMember = team.members.some((m) => m.id === newCaptainId);
    if (!isMember) {
      throw new BadRequestException(
        "Новый капитан должен быть участником команды.",
      );
    }

    await this.prisma.$transaction([
      this.prisma.team.update({
        where: { id: teamId },
        data: { captainId: newCaptainId },
      }),
      this.prisma.user.update({
        where: { id: newCaptainId },
        data: { role: Role.CAPTAIN },
      }),
      this.prisma.user.update({
        where: { id: currentCaptainId },
        data: { role: Role.PLAYER },
      }),
    ]);

    await this.cacheManager.del(generateTeamCacheKey(team.slug));

    return this.prisma.team.findUnique({ where: { id: teamId } }) as Promise<Team>;
  }

  async findPracticesForTeam(teamId: string) {
    return this.prisma.teamPractice.findMany({
      where: { teamId },
      include: { playground: { select: { name: true } } },
      orderBy: { date: "asc" },
    });
  }

  async createPractice(
    teamId: string,
    captainId: string,
    dto: CreatePracticeDto,
  ) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    if (team.captainId !== captainId) {
      throw new ForbiddenException(
        "Только капитан может планировать тренировки.",
      );
    }

    return this.prisma.teamPractice.create({
      data: {
        team: { connect: { id: teamId } },
        playground: { connect: { id: dto.playgroundId } },
        title: dto.title,
        description: dto.description,
        date: dto.date,
      },
    });
  }

  async getDashboardData(teamId: string) {
    const upcomingMatch = await this.prisma.match.findFirst({
      where: {
        status: "PLANNED",
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
      include: {
        team1: {
          select: { id: true, name: true, logo: true, dataAiHint: true },
        },
        team2: {
          select: { id: true, name: true, logo: true, dataAiHint: true },
        },
        tournament: { select: { name: true, game: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });

    const recentResults = await this.prisma.match.findMany({
      where: {
        status: "FINISHED",
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
      include: {
        team1: {
          select: { id: true, name: true, logo: true, dataAiHint: true },
        },
        team2: {
          select: { id: true, name: true, logo: true, dataAiHint: true },
        },
        tournament: { select: { name: true, game: true } },
      },
      orderBy: { finishedAt: "desc" },
      take: 2,
    });

    return {
      upcomingMatch: this._shapeMatch(upcomingMatch),
      recentResults: recentResults.map((match) => this._shapeMatch(match)),
    };
  }

  private _shapeMatch(match: MatchWithRelations | null) {
    if (!match) return null;
    return {
      id: String(match.id),
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
      date: format(new Date(match.scheduledAt), "d MMMM yyyy", { locale: ru }),
      href: `/matches/${match.id}`,
      status: match.status,
    };
  }

  async getCoachSummary(teamId: string): Promise<any> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    const dashboardData = await this.getDashboardData(teamId);

    const recentMatchesSummary =
      (dashboardData.recentResults || [])
        .map((match) => {
          if (!match) return '';
          const isTeam1 = match.team1.id === team.id;
          const scoreParts = match.score
            .split("-")
            .map((s: string) => parseInt(s, 10));
          const userTeamScore = isTeam1 ? scoreParts[0] : scoreParts[1];
          const opponentScore = isTeam1 ? scoreParts[1] : scoreParts[0];
          let resultText = "Ничья";
          if (!isNaN(userTeamScore) && !isNaN(opponentScore)) {
            if (userTeamScore > opponentScore) resultText = "Победа";
            if (userTeamScore < opponentScore) resultText = "Поражение";
          }
          const opponentName = isTeam1 ? match.team2.name : match.team1.name;
          return `${resultText} ${match.score} против '${opponentName}'`;
        })
        .join(", ") || "Нет недавних матчей.";

    // Fetch real stats for each player
    const playerStats = await Promise.all(
        team.members.map(async (player) => {
            const stats = await this.usersService.getStatsForUser(player.id);
            return {
                name: player.name,
                kda: (Math.random() * (1.8 - 0.8) + 0.8).toFixed(1),
                winRate: `${stats.summary.winrate}%`,
                recentPerformanceTrend: ["up", "down", "stable"][
                    Math.floor(Math.random() * 3)
                ] as "up" | "down" | "stable",
            };
        })
    );
    
    return analyzeTeamPerformance({
      teamName: team.name,
      recentMatches: recentMatchesSummary,
      playerStats,
    });
  }

  async remove(id: string): Promise<Team> {
    const team = await this.prisma.team.findUnique({ where: { id }});
    if (team) {
       await this.cacheManager.del(generateTeamCacheKey(team.slug));
       await this.cacheManager.del(generateLeaderboardCacheKey());
       await this.cacheManager.del(generateLeaderboardCacheKey(team.game));
    }
    return this.prisma.team.delete({ where: { id } });
  }
}
