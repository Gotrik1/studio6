
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Team } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { name, captainId, game } = createTeamDto;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return this.prisma.team.create({
      data: {
        name,
        slug,
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
    const teams = await this.prisma.team.findMany({
      include: {
        captain: true,
        _count: {
          select: { members: true },
        },
      },
    });

    // Map Prisma result to the shape expected by the frontend
    return teams.map(team => ({
      name: team.name,
      motto: team.motto || 'Девиз не указан',
      logo: team.logo || 'https://placehold.co/100x100.png',
      dataAiHint: team.dataAiHint || 'team logo',
      game: team.game,
      rank: team.rank || 99,
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
    const team = await this.prisma.team.findUnique({
      where: { slug },
      include: {
        captain: true,
        members: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
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
      rating: 'Immortal', // Mock data for now
      status: 'Онлайн', // Mock data for now
    }));

    return {
      name: team.name,
      motto: team.motto || 'Девиз не указан',
      logo: team.logo || 'https://placehold.co/100x100.png',
      dataAiHint: team.dataAiHint || 'team logo',
      game: team.game,
      rank: team.rank || 99,
      membersCount: team.members.length,
      captainName: team.captain.name,
      slug: team.slug,
      homePlaygroundId: team.homePlaygroundId,
      roster,
    };
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
