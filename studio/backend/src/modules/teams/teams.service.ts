import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Team } from '@prisma/client';

const mockTeams = [
    {
        name: 'Дворовые Атлеты',
        motto: 'Сила в единстве',
        logo: 'https://placehold.co/100x100.png',
        dataAiHint: 'athletic team logo',
        game: 'Футбол',
        rank: 1,
        members: 11,
        captain: 'Superuser',
        slug: 'dvotovyie-atlety',
        homePlaygroundId: 'playground-1',
    },
    {
        name: 'Соколы',
        motto: 'Высокий полет, точный удар',
        logo: 'https://placehold.co/100x100.png',
        dataAiHint: 'falcon logo',
        game: 'Баскетбол',
        rank: 2,
        members: 5,
        captain: 'ColdSniper',
        slug: 'sokoly',
        homePlaygroundId: 'playground-2',
    },
    {
        name: 'Торпедо',
        motto: 'Скорость и хитрость',
        logo: 'https://placehold.co/100x100.png',
        dataAiHint: 'torpedo logo',
        game: 'Хоккей',
        rank: 3,
        members: 6,
        captain: 'Foxy',
        slug: 'torpedo',
        homePlaygroundId: null,
    },
    {
        name: 'Вымпел',
        motto: 'Несокрушимая оборона',
        logo: 'https://placehold.co/100x100.png',
        dataAiHint: 'pennant logo',
        game: 'Волейбол',
        rank: 4,
        members: 6,
        captain: 'TheWall',
        slug: 'vympel',
        homePlaygroundId: null,
    },
];

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

  async findAll(): Promise<any[]> {
    // For now, return mock data that matches the frontend's expectation.
    // Later, this will query Prisma and map the data.
    return mockTeams;
  }

  async findOne(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id },
      include: { captain: true, members: true, tournaments: true },
    });
  }
  
  async joinTeam(teamId: string, userId: string): Promise<Team> {
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
