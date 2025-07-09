import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type { Sponsor } from "@prisma/client";

@Injectable()
export class SponsorsService implements OnModuleInit {
  private readonly logger = new Logger(SponsorsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.sponsor.count();
    if (count > 0) return;

    this.logger.log("Seeding sponsors...");
    await this.prisma.sponsor.createMany({
      data: [
        {
          id: "gfuel",
          name: "G-Fuel",
          logo: "https://placehold.co/100x100.png",
          logoHint: "energy drink logo",
          description:
            "The Official Energy Drink of Esports®. Find your flavor and power up your game.",
          profileUrl: "/profiles/sponsor/gfuel",
          interests: ["Киберспорт", "Экстрим"],
        },
        {
          id: "razer",
          name: "Razer",
          logo: "https://placehold.co/100x100.png",
          logoHint: "gaming peripherals logo",
          description:
            "For Gamers. By Gamers.™ High-performance gaming peripherals and laptops.",
          profileUrl: "/profiles/sponsor/razer",
          interests: ["Киберспорт", "Технологии"],
        },
        {
          id: "nike",
          name: "Nike",
          logo: "https://placehold.co/100x100.png",
          logoHint: "nike logo",
          description:
            "Just Do It. The world's leading designer, marketer, and distributor of authentic athletic footwear, apparel, equipment, and accessories.",
          profileUrl: "/profiles/sponsor/nike",
          interests: ["Спорт", "Одежда", "Обувь"],
        },
      ],
      skipDuplicates: true,
    });
    this.logger.log("Sponsors seeded successfully.");
  }

  findAll(): Promise<Sponsor[]> {
    return this.prisma.sponsor.findMany();
  }

  async findOne(id: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id },
      include: {
        promotions: true,
        teams: true, // Fetch full team objects
      },
    });

    if (!sponsor) {
      throw new NotFoundException(`Sponsor with ID ${id} not found.`);
    }

    return sponsor;
  }
}
