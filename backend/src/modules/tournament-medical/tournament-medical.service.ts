import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TournamentMedicalService {
  constructor(private prisma: PrismaService) {}

  async getAssignedMedicalStaff(tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        medicalPartners: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${tournamentId} не найден`);
    }

    return tournament.medicalPartners;
  }

  async assignMedicalStaff(tournamentId: string, partnerId: string) {
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        medicalPartners: {
          connect: { id: partnerId },
        },
      },
    });
    return { success: true };
  }

  async unassignMedicalStaff(tournamentId: string, partnerId: string) {
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        medicalPartners: {
          disconnect: { id: partnerId },
        },
      },
    });
    return { success: true };
  }
}
