import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CreateQuestDto } from "./dto/create-quest.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Quest, QuestType } from "@prisma/client";
import { quests as initialQuestData } from "../../shared/lib/mock-data/gamification";

@Injectable()
export class QuestsService implements OnModuleInit {
  private readonly logger = new Logger(QuestsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedQuests();
  }

  async seedQuests() {
    const count = await this.prisma.quest.count();
    if (count > 0) return;

    this.logger.log("Seeding initial quests...");

    const questsToCreate = [
      ...initialQuestData.daily.map((q) => ({ ...q, type: QuestType.DAILY })),
      ...initialQuestData.weekly.map((q) => ({ ...q, type: QuestType.WEEKLY })),
      ...initialQuestData.special.map((q) => ({
        ...q,
        type: QuestType.SPECIAL,
      })),
    ];

    for (const questData of questsToCreate) {
      await this.prisma.quest.create({
        data: {
          title: questData.title,
          description: questData.description,
          reward: questData.reward,
          goal: questData.goal,
          href: questData.href,
          type: questData.type,
        },
      });
    }

    this.logger.log("Initial quests seeded successfully.");
  }

  create(createQuestDto: CreateQuestDto): Promise<Quest> {
    return this.prisma.quest.create({
      data: createQuestDto,
    });
  }

  findAll(): Promise<Quest[]> {
    return this.prisma.quest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  remove(id: string): Promise<Quest> {
    return this.prisma.quest.delete({
      where: { id },
    });
  }
}
