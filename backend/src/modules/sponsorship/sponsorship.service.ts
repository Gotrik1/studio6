import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class SponsorshipService implements OnModuleInit {
  private readonly logger = new Logger(SponsorshipService.name);
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSponsorships();
  }

  async seedSponsorships() {
    const count = await this.prisma.sponsorship.count();
    if (count > 0) return;

    this.logger.log("Seeding initial sponsorships...");

    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: "gfuel" },
    });
    const team = await this.prisma.team.findUnique({
      where: { slug: "dvotovyie-atlety" },
    });

    if (sponsor && team) {
      await this.prisma.sponsorship.create({
        data: {
          sponsorId: sponsor.id,
          teamId: team.id,
          amount: 50000,
        },
      });
      this.logger.log("Sponsorship seeded successfully.");
    } else {
      this.logger.warn("Could not find sponsor or team to seed sponsorship.");
    }
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
        investment: `${s.amount.toString()} PD`, // Now real data
        since: s.signedAt.toISOString().split("T")[0],
      })),
      teamsSeekingSponsorship: teamsSeekingSponsorship.map((t) => ({
        slug: t.slug,
        name: t.name,
        logo: t.logo || "",
        logoHint: t.dataAiHint || "team logo",
        game: t.game,
        pitch:
          t.pitch || `Команда ${t.name} ищет поддержки для участия в турнирах.`,
      })),
    };
  }
}
