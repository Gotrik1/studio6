import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Tournament } from '@prisma/client';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const { name, game, format, prizePool, startDate } = createTournamentDto;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return this.prisma.tournament.create({
      data: {
        name,
        slug,
        game,
        format,
        prizePool,
        startDate,
        status: 'REGISTRATION',
      },
    });
  }

  async startTournament(id: string): Promise<Tournament> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: { teams: true },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${id} не найден`);
    }
    if (tournament.status !== 'REGISTRATION') {
      throw new BadRequestException('Турнир уже начался или завершен.');
    }
    if (tournament.teams.length < 2) {
      throw new BadRequestException(
        'Недостаточно команд для начала турнира (минимум 2).',
      );
    }
    if (tournament.teams.length % 2 !== 0) {
      throw new BadRequestException(
        'Для начала турнира требуется четное количество команд.',
      );
    }

    // Простая логика жеребьевки: перемешиваем и создаем пары
    const shuffledTeams = tournament.teams.sort(() => 0.5 - Math.random());
    const matchesToCreate = [];
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      matchesToCreate.push({
        team1Id: shuffledTeams[i].id,
        team2Id: shuffledTeams[i + 1].id,
        tournamentId: id,
        status: 'PLANNED',
        scheduledAt: new Date(), // Placeholder для логики расписания
      });
    }

    // Используем транзакцию, чтобы оба действия выполнились успешно
    return this.prisma.$transaction(async (tx) => {
      await tx.match.createMany({
        data: matchesToCreate,
      });

      return tx.tournament.update({
        where: { id },
        data: {
          status: 'ONGOING',
        },
      });
    });
  }

  async findAll(): Promise<any[]> {
    const tournaments = await this.prisma.tournament.findMany({
      include: { _count: { select: { teams: true } } },
    });

    // Map to frontend shape
    return tournaments.map(t => {
      let statusText = 'Завершен';
      if (t.status === 'REGISTRATION') statusText = 'Регистрация';
      if (t.status === 'ONGOING') statusText = 'Идет';

      return {
        name: t.name,
        game: t.game,
        prize: `${t.prizePool} PD`,
        status: statusText,
        date: format(new Date(t.startDate), 'd MMMM yyyy', { locale: ru }),
        image: t.bannerImage || 'https://placehold.co/2560x720.png',
        dataAiHint: t.bannerImageHint || 'esports tournament',
        slug: t.slug || t.name.toLowerCase().replace(/\s+/g, '-'),
      };
    });
  }

  async findOne(id: string): Promise<Tournament | null> {
    return this.prisma.tournament.findUnique({
      where: { id },
      include: { teams: true, matches: true },
    });
  }

  async registerTeam(
    tournamentId: string,
    teamId: string,
  ): Promise<Tournament> {
    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        teams: {
          connect: { id: teamId },
        },
      },
      include: { teams: true },
    });
  }

  async remove(id: string): Promise<Tournament> {
    return this.prisma.tournament.delete({ where: { id } });
  }
}
