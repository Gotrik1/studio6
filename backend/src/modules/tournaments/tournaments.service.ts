import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Tournament } from '@prisma/client';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const { name, game, format, prizePool, startDate } = createTournamentDto;
    return this.prisma.tournament.create({
      data: {
        name,
        game,
        format,
        prizePool,
        startDate,
        status: 'REGISTRATION',
      },
    });
  }

  async findAll(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({
      include: { teams: true, matches: true },
    });
  }

  async findOne(id: string): Promise<Tournament | null> {
    return this.prisma.tournament.findUnique({
      where: { id },
      include: { teams: true, matches: true },
    });
  }

  async registerTeam(tournamentId: string, teamId: string): Promise<Tournament> {
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
