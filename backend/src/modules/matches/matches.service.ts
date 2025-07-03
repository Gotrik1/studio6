import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Match } from '@prisma/client';
import { UpdateMatchDto } from './dto/update-match.dto';

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

  async findAll(): Promise<Match[]> {
    return this.prisma.match.findMany({
      include: { team1: true, team2: true, tournament: true },
    });
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
