
import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { nutritionItems } from "./seed-data";
import { CreateFoodLogDto } from "./dto/create-food-log.dto";

@Injectable()
export class NutritionService implements OnModuleInit {
  private readonly logger = new Logger(NutritionService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedFoodItems();
  }

  async seedFoodItems() {
    const count = await this.prisma.foodItem.count();
    if (count === 0) {
      this.logger.log("Seeding food items...");
      await this.prisma.foodItem.createMany({
        data: nutritionItems.map(({ id: _id, ...rest }) => rest),
        skipDuplicates: true,
      });
      this.logger.log("Food items seeded successfully.");
    }
  }

  findAllFoodItems() {
    return this.prisma.foodItem.findMany();
  }

  async findLogForUser(userId: string) {
    return this.prisma.foodLogEntry.findMany({
      where: { userId },
      include: {
        foodItem: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createLogEntry(userId: string, createFoodLogDto: CreateFoodLogDto) {
    return this.prisma.foodLogEntry.create({
      data: {
        userId,
        ...createFoodLogDto,
      },
    });
  }

  async deleteLogEntry(id: string, userId: string) {
    const logEntry = await this.prisma.foodLogEntry.findUnique({
      where: { id },
    });

    if (!logEntry) {
      throw new NotFoundException(`Запись с ID ${id} не найдена.`);
    }

    if (logEntry.userId !== userId) {
      throw new ForbiddenException("Вы не можете удалить чужую запись.");
    }

    return this.prisma.foodLogEntry.delete({ where: { id } });
  }
}
