import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CoachDto } from "./dto/coach.dto";
import { Role, UserStatus } from "@prisma/client";

@Injectable()
export class CoachesService implements OnModuleInit {
  private readonly logger = new Logger(CoachesService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedCoaches();
  }

  async seedCoaches() {
    const coachCount = await this.prisma.user.count({
      where: { role: Role.COACH },
    });
    if (coachCount > 0) return;

    this.logger.log("Seeding coach...");

    const coachUser = await this.prisma.user.upsert({
      where: { id: "3" },
      update: {},
      create: {
        id: "3",
        email: "coach.maria@example.com",
        name: 'Мария "Shadow" Петрова',
        passwordHash: "seeded",
        role: Role.COACH,
        status: UserStatus.ACTIVE,
        xp: 7500,
        avatar: "https://placehold.co/100x100.png",
        mainSport: "Valorant",
      },
    });

    await this.prisma.coachProfile.create({
      data: {
        userId: coachUser.id,
        specialization: "Тактический шутер (Valorant, CS:GO)",
        description:
          "Бывший профессиональный игрок, специализируюсь на стратегическом анализе и индивидуальной подготовке снайперов. Помогу улучшить понимание игры, принятие решений и механику стрельбы.",
        tags: ["aim", "strategy", "game-sense", "valorant"],
        experience: "5 лет профессиональной сцены, 3 года тренерской работы",
        rating: 4.9,
        price: 1500,
      },
    });

    this.logger.log("Coach seeded successfully.");
  }

  async findAll(): Promise<CoachDto[]> {
    const coachesWithProfiles = await this.prisma.user.findMany({
      where: {
        role: Role.COACH,
        coachProfile: { isNot: null },
      },
      include: {
        coachProfile: true,
      },
    });

    return coachesWithProfiles.map((user) => ({
      id: user.coachProfile!.id,
      name: user.name,
      avatar: user.avatar,
      avatarHint: "sports coach portrait",
      specialization: user.coachProfile!.specialization,
      description: user.coachProfile!.description,
      experience: user.coachProfile!.experience,
      tags: user.coachProfile!.tags,
      rating: user.coachProfile!.rating,
      price: user.coachProfile!.price.toString(),
      profileUrl: `/profiles/coach/${user.id}`,
    }));
  }
}
