import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class SponsorshipService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const sponsoredTeams = await this.prisma.team.findMany({
      where: {
        sponsors: { some: {} },
      },
      take: 5,
    });

    const teamsSeekingSponsorship = await this.prisma.team.findMany({
      where: {
        seekingSponsorship: true,
      },
      take: 5,
    });

    return {
      sponsoredTeams: sponsoredTeams.map((t) => ({
        slug: t.slug,
        name: t.name,
        logo: t.logo || "",
        logoHint: t.dataAiHint || "team logo",
        investment: "50,000 PD", // This would be calculated in a real app
        since: t.updatedAt.toISOString().split("T")[0],
      })),
      teamsSeekingSponsorship: teamsSeekingSponsorship.map((t) => ({
        slug: t.slug,
        name: t.name,
        logo: t.logo || "",
        logoHint: t.dataAiHint || "team logo",
        game: t.game,
        pitch:
          t.motto || `Команда ${t.name} ищет поддержки для участия в турнирах.`,
      })),
    };
  }
}
