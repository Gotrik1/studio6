import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Match } from '@prisma/client';
import { UpdateMatchDto } from './dto/update-match.dto';
import { format } from 'date-fns';

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
        team1: { select: { name: true, logo: true, dataAiHint: true } },
        team2: { select: { name: true, logo: true, dataAiHint: true } },
        tournament: { select: { name: true, game: true } },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    const statusMap = {
      PLANNED: 'Предстоящий',
      LIVE: 'Идет',
      FINISHED: 'Завершен',
      DISPUTED: 'Спорный',
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
      score: match.score || 'VS',
      tournament: match.tournament?.name || 'Товарищеский матч',
      game: match.tournament?.game || 'Неизвестно',
      date: format(new Date(match.scheduledAt), 'yyyy-MM-dd'),
      status: statusMap[match.status],
      href: `/matches/${match.id}`,
      playgroundId: null, // Assuming this is not in the DB model yet
    }));
  }

  async findOne(id: string): Promise<Match | null> {
    return this.prisma.match.findUnique({
      where: { id },
      include: { team1: true, team2: true, tournament: true },
    });
  }

  async updateScore(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const { score1, score2 } = updateMatchDto;

    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    const team1Update: {
      wins?: { increment: 1 };
      losses?: { increment: 1 };
      draws?: { increment: 1 };
    } = {};
    const team2Update: {
      wins?: { increment: 1 };
      losses?: { increment: 1 };
      draws?: { increment: 1 };
    } = {};

    if (score1 > score2) {
      team1Update.wins = { increment: 1 };
      team2Update.losses = { increment: 1 };
    } else if (score2 > score1) {
      team1Update.losses = { increment: 1 };
      team2Update.wins = { increment: 1 };
    } else {
      team1Update.draws = { increment: 1 };
      team2Update.draws = { increment: 1 };
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.team.update({
        where: { id: match.team1Id },
        data: team1Update,
      });
      await tx.team.update({
        where: { id: match.team2Id },
        data: team2Update,
      });

      const updatedMatch = await tx.match.update({
        where: { id },
        data: {
          score: `${score1}-${score2}`,
          status: 'FINISHED',
          finishedAt: new Date(),
        },
      });

      return updatedMatch;
    });
  }

  async remove(id: string): Promise<Match> {
    return this.prisma.match.delete({ where: { id } });
  }
}
