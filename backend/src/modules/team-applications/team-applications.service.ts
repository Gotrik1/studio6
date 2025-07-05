import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TeamApplicationStatus } from '@prisma/client';
import { CreateTeamApplicationDto } from './dto/create-team-application.dto';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class TeamApplicationsService {
  constructor(private prisma: PrismaService, private teamsService: TeamsService) {}

  async findForTeam(teamId: string, captainId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team || team.captainId !== captainId) {
      throw new ForbiddenException('Only the captain can view applications.');
    }
    return this.prisma.teamApplication.findMany({
      where: { teamId, status: 'PENDING', tournamentId: null },
      include: { user: { select: { id: true, name: true, avatar: true, role: true } } },
    });
  }

  async create(userId: string, dto: CreateTeamApplicationDto) {
    const { teamId, message } = dto;
    
    const isMember = await this.prisma.team.findFirst({
        where: { id: teamId, members: { some: { id: userId } } }
    });

    if (isMember) {
        throw new ConflictException('You are already a member of this team.');
    }

    const existingApplication = await this.prisma.teamApplication.findFirst({
      where: { teamId, userId, tournamentId: null, status: 'PENDING' },
    });
    if (existingApplication) {
      throw new ConflictException('You have already applied to this team.');
    }
    return this.prisma.teamApplication.create({
      data: { teamId, userId, message, tournamentId: null },
    });
  }

  async accept(applicationId: string, captainId: string) {
    const application = await this.prisma.teamApplication.findUnique({
      where: { id: applicationId },
      include: { team: true },
    });

    if (!application || !application.team || application.team.captainId !== captainId) {
      throw new ForbiddenException('Application not found or you are not the captain.');
    }
    
    await this.teamsService.joinTeam(application.teamId, application.userId);
    
    return this.prisma.teamApplication.update({
        where: { id: applicationId },
        data: { status: 'APPROVED' },
        include: { team: true }
    });
  }

  async decline(applicationId: string, captainId: string) {
     const application = await this.prisma.teamApplication.findUnique({
      where: { id: applicationId },
      include: { team: true },
    });

    if (!application || !application.team || application.team.captainId !== captainId) {
      throw new ForbiddenException('Application not found or you are not the captain.');
    }
    return this.prisma.teamApplication.update({
      where: { id: applicationId },
      data: { status: 'DECLINED' },
       include: { team: true }
    });
  }
}
