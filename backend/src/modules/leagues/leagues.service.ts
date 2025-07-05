import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class LeaguesService implements OnModuleInit {
  private readonly logger = new Logger(LeaguesService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedLeagues();
  }

  async seedLeagues() {
    const leagueCount = await this.prisma.league.count();
    if (leagueCount > 0) return;

    this.logger.log('Seeding leagues...');
    
    const teams = await this.prisma.team.findMany({ take: 4 });
    if (teams.length < 4) {
      this.logger.warn('Not enough teams to seed a league. Skipping.');
      return;
    }

    const league = await this.prisma.league.create({
      data: {
        name: 'ProDvor: Футбольная Лига - Сезон 1',
        description: 'Главная лига по дворовому футболу 5x5 на платформе. Лучшие команды соревнуются за звание чемпиона сезона.',
        game: 'Футбол',
        image: 'https://placehold.co/2560x720.png',
        imageHint: 'football league banner',
      },
    });

    const leagueTeamsData = [
      { teamId: teams[0].id, played: 3, wins: 3, losses: 0, draws: 0, points: 9 },
      { teamId: teams[1].id, played: 3, wins: 2, losses: 1, draws: 0, points: 6 },
      { teamId: teams[2].id, played: 3, wins: 1, losses: 2, draws: 0, points: 3 },
      { teamId: teams[3].id, played: 3, wins: 0, losses: 3, draws: 0, points: 0 },
    ];

    for (const lt of leagueTeamsData) {
      await this.prisma.leagueTeam.create({
        data: {
          leagueId: league.id,
          ...lt,
        },
      });
    }

    const matchesData = [
      { team1Id: teams[0].id, team2Id: teams[3].id, team1Score: 5, team2Score: 2, scheduledAt: new Date('2024-08-03T18:00:00Z'), status: 'FINISHED' as const },
      { team1Id: teams[1].id, team2Id: teams[2].id, team1Score: 2, team2Score: 1, scheduledAt: new Date('2024-08-03T19:00:00Z'), status: 'FINISHED' as const },
      { team1Id: teams[0].id, team2Id: teams[1].id, team1Score: 3, team2Score: 1, scheduledAt: new Date('2024-08-10T18:00:00Z'), status: 'FINISHED' as const },
      { team1Id: teams[2].id, team2Id: teams[3].id, team1Score: 4, team2Score: 2, scheduledAt: new Date('2024-08-10T19:00:00Z'), status: 'FINISHED' as const },
    ];

    for (const match of matchesData) {
      await this.prisma.match.create({
        data: {
          leagueId: league.id,
          ...match,
        },
      });
    }
    
    this.logger.log('Leagues seeded successfully.');
  }

  findAll() {
    return this.prisma.league.findMany();
  }

  findOne(id: string) {
    return this.prisma.league.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
        matches: {
          include: {
            team1: { select: { name: true, logo: true, dataAiHint: true } },
            team2: { select: { name: true, logo: true, dataAiHint: true } },
          },
        },
      },
    });
  }
}
