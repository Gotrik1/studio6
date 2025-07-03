import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Match } from '@prisma/client';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const { team1Id, team2Id, tournamentId, scheduledAt } = createMatchDto;
    return this.prisma.match.create({
      data: {
        team1: { connect: { id: team1Id } },
        team2: { connect: { id: team2Id } },
        tournament: tournamentId ? { connect: { id: tournamentId } } : undefined,
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

  async remove(id: string): Promise<Match> {
    return this.prisma.match.delete({ where: { id } });
  }
}
