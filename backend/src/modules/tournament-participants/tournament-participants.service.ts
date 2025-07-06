import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { TeamApplicationStatus } from "@prisma/client";

@Injectable()
export class TournamentParticipantsService {
  constructor(private prisma: PrismaService) {}

  async getApplications(tournamentId: string) {
    return this.prisma.teamApplication.findMany({
      where: {
        tournamentId,
        status: "PENDING",
      },
      include: {
        team: {
          include: {
            captain: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getParticipants(tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        teams: {
          include: {
            captain: { select: { id: true, name: true } },
            members: {
              select: { id: true, name: true, avatar: true, role: true },
            },
          },
        },
      },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    return tournament.teams;
  }

  async updateApplicationStatus(
    applicationId: string,
    status: TeamApplicationStatus,
  ) {
    const application = await this.prisma.teamApplication.findUnique({
      where: { id: applicationId },
      include: { tournament: true },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with ID ${applicationId} not found`,
      );
    }

    if (application.status !== "PENDING") {
      throw new BadRequestException(
        "This application has already been processed.",
      );
    }

    if (status === "APPROVED") {
      const tournament = application.tournament;
      const teamCount = await this.prisma.team.count({
        where: { tournaments: { some: { id: tournament.id } } },
      });

      if (teamCount >= tournament.participantCount) {
        throw new ConflictException("Tournament is full.");
      }

      return this.prisma.$transaction(async (tx) => {
        await tx.tournament.update({
          where: { id: application.tournamentId },
          data: {
            teams: {
              connect: { id: application.teamId },
            },
          },
        });
        return tx.teamApplication.update({
          where: { id: applicationId },
          data: { status: "APPROVED" },
        });
      });
    }

    if (status === "REJECTED") {
      return this.prisma.teamApplication.update({
        where: { id: applicationId },
        data: { status: "REJECTED" },
      });
    }
  }

  async removeParticipant(tournamentId: string, teamId: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.tournament.update({
        where: { id: tournamentId },
        data: {
          teams: {
            disconnect: { id: teamId },
          },
        },
      });
      // Also update the original application if it exists
      await tx.teamApplication.updateMany({
        where: {
          tournamentId,
          teamId,
        },
        data: {
          status: "PENDING", // Or 'REMOVED' if you add that status
        },
      });
    });
    return { success: true };
  }
}
