import { Inject, Injectable, NotFoundException, BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Team, ActivityType, Prisma } from '@prisma/client';
import { LeaderboardTeamDto } from './dto/leaderboard-team.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TeamsService implements OnModuleInit {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    await this.seedTeams();
  }

  async seedTeams() {
    const teamCount = await this.prisma.team.count();
    if (teamCount > 0) return;

    this.logger.log('Seeding initial teams...');
    
    // Ensure a user exists to be a captain
    let captain = await this.prisma.user.findFirst();
    if (!captain) {
        captain = await this.prisma.user.create({
            data: {
                email: 'captain@example.com',
                name: 'Captain Seed',
                passwordHash: 'seeded',
                role: 'Капитан',
            }
        });
    }

    const teamsToCreate = [
      { name: 'Дворовые Атлеты', game: 'Футбол', motto: 'Играем сердцем', slug: 'dvotovyie-atlety' },
      { name: 'Соколы', game: 'Футбол', motto: 'Выше только небо', slug: 'sokoly' },
      { name: 'Торпедо', game: 'Футбол', motto: 'Только вперед', slug: 'torpedo' },
      { name: 'Вымпел', game: 'Футбол', motto: 'Сила в единстве', slug: 'vympel' },
    ];

    for (const teamData of teamsToCreate) {
        // Need a unique captain for each team
        const teamCaptain = await this.prisma.user.create({
            data: {
                email: `${teamData.slug}@example.com`,
                name: `Captain ${teamData.name}`,
                passwordHash: 'seeded',
                role: 'Капитан',
            }
        });

        await this.prisma.team.create({
            data: {
                ...teamData,
                creatorId: teamCaptain.id,
                captainId: teamCaptain.id,
            }
        });
    }
     this.logger.log('Initial teams seeded.');
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name, captainId, game, motto, logo, dataAiHint } = createTeamDto;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return this.prisma.team.create({
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
  }

  async findAll(): Promise<any[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        captain: {
          select: { name: true }
        },
        _count: {
          select: { members: true },
        },
      },
    });

    // Map Prisma result to the shape expected by the frontend
    return teams.map(team => ({
      id: team.id,
      name: team.name,
      motto: team.motto || 'Девиз не указан',
      logo: team.logo || 'https://placehold.co/100x100.png',
      dataAiHint: team.dataAiHint || 'team logo',
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
    const cacheKey = `team_slug_${slug}`;
    const cachedTeam = await this.cacheManager.get<any>(cacheKey);

    if (cachedTeam) {
      return cachedTeam;
    }

    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: {
        captain: {
          select: { name: true }
        },
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Команда со слагом "${slug}" не найдена`);
    }

    const roster = team.members.map((member) => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar || 'https://placehold.co/100x100.png',
      role: member.role,
      rating: 'Immortal', // This can stay as mock for now, as ELO/Rating is not in the schema yet.
      status: member.status,
    }));

    const result = {
      id: team.id,
      name: team.name,
      motto: team.motto || 'Девиз не указан',
      logo: team.logo || 'https://placehold.co/100x100.png',
      dataAiHint: team.dataAiHint || 'team logo',
      game: team.game,
      rank: team.rank,
      membersCount: team.members.length,
      captainId: team.captainId,
      slug: team.slug,
      homePlaygroundId: team.homePlaygroundId,
      roster,
    };

    await this.cacheManager.set(cacheKey, result); // TTL is set globally in CacheModule
    return result;
  }
  
  async getLeaderboard(params?: { game?: string }): Promise<LeaderboardTeamDto[]> {
    const cacheKey = `leaderboard_teams_${params?.game || 'all'}`;
    const cachedLeaderboard = await this.cacheManager.get<LeaderboardTeamDto[]>(cacheKey);

    if (cachedLeaderboard) {
      return cachedLeaderboard;
    }
    
    const whereClause = params?.game ? Prisma.sql`WHERE game = ${params.game}` : Prisma.empty;

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
    
    await this.cacheManager.set(cacheKey, result); // TTL is set globally in CacheModule
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
      throw new BadRequestException('Вы уже являетесь участником этой команды.');
    }
    
    await this.prisma.activity.create({
        data: {
            type: ActivityType.TEAM_JOINED,
            userId: userId,
            metadata: {
                teamName: team.name,
                teamHref: `/teams/${team.slug}`,
                icon: 'Users',
            }
        }
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

  async remove(id: string): Promise<Team> {
    return this.prisma.team.delete({ where: { id } });
  }
}
