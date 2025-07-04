import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Match, MatchStatus } from '@prisma/client';
import { UpdateMatchDto } from './dto/update-match.dto';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const { team1Id, team2Id, tournamentId, scheduledAt } = createMatchDto;
    return this.prisma.match.create({
      data: {
        team1: { connect: { id: team1Id } },
        team2: { connect: { id: team2Id } },
        tournament: tournamentId
          ? { connect: { id: tournamentId } }
          : undefined,
        scheduledAt,
        status: 'PLANNED',
      },
    });
  }

  async findAll(): Promise<any[]> {
    const matches = await this.prisma.match.findMany({
      include: {
        team1: { select: { name: true, logo: true, dataAiHint: true, slug: true } },
        team2: { select: { name: true, logo: true, dataAiHint: true, slug: true } },
        tournament: { select: { name: true, game: true } },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    const statusMap: Record<MatchStatus, string> = {
      PLANNED: 'Предстоящий',
      LIVE: 'Идет',
      FINISHED: 'Завершен',
      DISPUTED: 'Спорный',
      CANCELLED: 'Отменен',
    };

    return matches.map((match) => ({
      id: match.id,
      team1: {
        name: match.team1.name,
        logo: match.team1.logo || 'https://placehold.co/100x100.png',
        logoHint: match.team1.dataAiHint || 'team logo',
      },
      team2: {
        name: match.team2.name,
        logo: match.team2.logo || 'https://placehold.co/100x100.png',
        logoHint: match.team2.dataAiHint || 'team logo',
      },
      score:
        match.team1Score !== null && match.team2Score !== null
          ? `${match.team1Score}-${match.team2Score}`
          : 'VS',
      tournament: match.tournament?.name || 'Товарищеский матч',
      game: match.tournament?.game || 'Неизвестно',
      date: format(new Date(match.scheduledAt), 'yyyy-MM-dd'),
      status: statusMap[match.status],
      href: `/matches/${match.id}`,
      playgroundId: null, // Assuming this is not in the DB model yet
    }));
  }

  async findOne(id: string): Promise<any | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        team1: {
          include: { members: { select: { id: true, name: true, role: true, avatar: true } } },
        },
        team2: {
          include: { members: { select: { id: true, name: true, role: true, avatar: true } } },
        },
        tournament: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    // Map Prisma result to the frontend's MatchDetails shape, without mock data
    return {
      id: match.id,
      tournament: match.tournament?.name || 'Товарищеский матч',
      status: match.status === 'FINISHED' ? 'Завершен' : match.status === 'PLANNED' ? 'Запланирован' : 'Идет',
      score:
        match.team1Score !== null && match.team2Score !== null
          ? `${match.team1Score}-${match.team2Score}`
          : 'VS',
      date: format(new Date(match.scheduledAt), 'd MMMM yyyy', { locale: ru }),
      time: format(new Date(match.scheduledAt), 'HH:mm'),
      location: match.location || 'Место не указано',
      referee: { name: match.refereeName || 'Судья не назначен' },
      team1: {
        name: match.team1.name,
        logo: match.team1.logo || 'https://placehold.co/100x100.png',
        logoHint: match.team1.dataAiHint || 'team logo',
      },
      team2: {
        name: match.team2.name,
        logo: match.team2.logo || 'https://placehold.co/100x100.png',
        logoHint: match.team2.dataAiHint || 'team logo',
      },
      lineups: {
        team1: match.team1.members
          .map((m) => ({
            name: m.name,
            role: m.role,
            avatar: m.avatar || 'https://placehold.co/40x40.png',
            avatarHint: 'sports player',
          })),
        team2: match.team2.members
          .map((m) => ({
            name: m.name,
            role: m.role,
            avatar: m.avatar || 'https://placehold.co/40x40.png',
            avatarHint: 'sports player',
          })),
      },
      // Note: events, teamStats, and media are no longer provided from the backend mock.
      // The frontend will need to handle their absence.
    };
  }

  async updateScore(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const { score1, score2 } = updateMatchDto;
    // Basic validation
    if (score1 === undefined || score2 === undefined) {
      throw new BadRequestException('Необходимо указать счет обеих команд.');
    }

    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    return this.prisma.match.update({
      where: { id },
      data: {
        team1Score: score1,
        team2Score: score2,
        status: 'FINISHED',
        finishedAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<Match> {
    return this.prisma.match.delete({ where: { id } });
  }
}
