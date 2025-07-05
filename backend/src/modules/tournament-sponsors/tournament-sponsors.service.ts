import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { Sponsor } from '@prisma/client';

@Injectable()
export class TournamentSponsorsService {
  constructor(private prisma: PrismaService) {}

  async getAssignedSponsors(tournamentId: string): Promise<Sponsor[]> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        sponsors: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${tournamentId} не найден`);
    }

    return tournament.sponsors;
  }

  async assignSponsor(tournamentId: string, sponsorId: string) {
    // Ensure both exist before attempting to connect
    const tournament = await this.prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw new NotFoundException('Турнир не найден.');

    const sponsor = await this.prisma.sponsor.findUnique({ where: { id: sponsorId } });
    if (!sponsor) throw new NotFoundException('Спонсор не найден.');

    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        sponsors: {
          connect: { id: sponsorId },
        },
      },
    });
    return { success: true };
  }

  async unassignSponsor(tournamentId: string, sponsorId: string) {
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        sponsors: {
          disconnect: { id: sponsorId },
        },
      },
    });
    return { success: true };
  }
}
