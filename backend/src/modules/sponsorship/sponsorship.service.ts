import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class SponsorshipService implements OnModuleInit {
  private readonly logger = new Logger(SponsorshipService.name);
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seeding is now handled by SponsorshipOffersService when an offer is accepted
  }

  async getDashboardData() {
    const sponsorships = await this.prisma.sponsorship.findMany({
      take: 5,
      orderBy: {
        signedAt: "desc",
      },
      include: {
        team: true,
      },
    });

    const teamsSeekingSponsorship = await this.prisma.team.findMany({
      where: {
        seekingSponsorship: true,
      },
      take: 5,
    });

    return {
      sponsoredTeams: sponsorships.map((s) => ({
        slug: s.team.slug,
        name: s.team.name,
        logo: s.team.logo || "",
        logoHint: s.team.dataAiHint || "team logo",
        investment: `${Number(s.amount).toLocaleString('ru-RU')} PD`,
        since: s.signedAt.toISOString().split("T")[0],
      })),
      teamsSeekingSponsorship: teamsSeekingSponsorship.map((t) => ({
        slug: t.slug,
        name: t.name,
        logo: t.logo || "",
        logoHint: t.dataAiHint || "team logo",
        game: t.game,
        pitch: t.pitch || `Команда ${t.name} ищет поддержки для участия в турнирах.`,
      })),
    };
  }
}
