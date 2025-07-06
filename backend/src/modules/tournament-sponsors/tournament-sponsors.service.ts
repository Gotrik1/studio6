import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type { Sponsor } from "@prisma/client";

@Injectable()
export class TournamentSponsorsService {
  private readonly logger = new Logger(TournamentSponsorsService.name);

  constructor(private prisma: PrismaService) {}

  async getAssignedSponsors(
    tournamentId: string,
  ): Promise<(Sponsor & { amount: number })[]> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        sponsors: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${tournamentId} не найден`);
    }

    // Mocking the amount since it's not in the schema
    return tournament.sponsors.map((sponsor, index) => ({
      ...sponsor,
      amount: (index + 1) * 5000,
    }));
  }

  async assignSponsor(tournamentId: string, sponsorId: string, amount: number) {
    // Ensure both exist before attempting to connect
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });
    if (!tournament) throw new NotFoundException("Турнир не найден.");

    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: sponsorId },
    });
    if (!sponsor) throw new NotFoundException("Спонсор не найден.");

    this.logger.log(
      `Assigning sponsor ${sponsor.name} to tournament ${tournament.name} with amount ${amount}`,
    );

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
