import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Team } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name, captainId, game } = createTeamDto;
    return this.prisma.team.create({
      data: {
        name,
        game,
        captain: {
          connect: { id: captainId },
        },
        members: {
          connect: { id: captainId },
        },
      },
    });
  }

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany({
      include: { captain: true, members: true },
    });
  }

  async findOne(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id },
      include: { captain: true, members: true, tournaments: true },
    });
  }

  async remove(id: string): Promise<Team> {
    return this.prisma.team.delete({ where: { id } });
  }
}
