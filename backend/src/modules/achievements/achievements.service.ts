import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { achievements as mockAchievements } from "./mock-data";

@Injectable()
export class AchievementsService implements OnModuleInit {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAchievements();
  }

  async seedAchievements() {
    const count = await this.prisma.achievement.count();
    if (count > 0) return;

    this.logger.log("Seeding achievements...");
    await this.prisma.achievement.createMany({
      data: mockAchievements.map((a) => ({
        name: a.name,
        description: a.description,
        icon: a.icon,
      })),
      skipDuplicates: true,
    });

    // For demo, unlock some achievements for the first user
    const user = await this.prisma.user.findFirst();
    const achievementsToUnlock = await this.prisma.achievement.findMany({
      where: {
        name: {
          in: [
            "Первая победа",
            "Командный игрок",
            "Железная воля",
            "Меткий удар",
            "Конструктор успеха",
          ],
        },
      },
    });

    if (user && achievementsToUnlock.length > 0) {
      await this.prisma.userAchievement.createMany({
        data: achievementsToUnlock.map((ach) => ({
          userId: user.id,
          achievementId: ach.id,
        })),
        skipDuplicates: true,
      });
    }
    this.logger.log("Achievements seeded successfully.");
  }

  async findAllForUser(userId: string) {
    const allAchievements = await this.prisma.achievement.findMany();
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    return allAchievements.map((ach) => ({
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      unlocked: unlockedIds.has(ach.id),
    }));
  }
}
