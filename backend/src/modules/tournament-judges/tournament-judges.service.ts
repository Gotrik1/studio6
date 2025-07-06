import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class TournamentJudgesService {
  constructor(private prisma: PrismaService) {}

  async getAssignedJudges(tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        judges: true, // Fetch the full User object for each judge
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${tournamentId} не найден`);
    }

    return tournament.judges;
  }

  async assignJudge(tournamentId: string, judgeId: string) {
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        judges: {
          connect: { id: judgeId },
        },
      },
    });
    return { success: true };
  }

  async unassignJudge(tournamentId: string, judgeId: string) {
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        judges: {
          disconnect: { id: judgeId },
        },
      },
    });
    return { success: true };
  }
}
