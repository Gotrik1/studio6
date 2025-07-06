import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { sportsList } from "./seed-data";
import { CreateSportDto } from "./dto/create-sport.dto";
import { Sport } from "@prisma/client";

@Injectable()
export class SportsService implements OnModuleInit {
  private readonly logger = new Logger(SportsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSports();
  }

  async seedSports() {
    const count = await this.prisma.sport.count();
    if (count > 0) return;

    this.logger.log("Seeding sports...");
    await this.prisma.sport.createMany({
      data: sportsList,
      skipDuplicates: true,
    });
    this.logger.log("Sports seeded successfully.");
  }

  async create(createSportDto: CreateSportDto): Promise<Sport> {
    const { name, icon, category } = createSportDto;
    const id = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const existing = await this.prisma.sport.findUnique({ where: { id } });
    if (existing) {
      throw new ConflictException(`Sport with id ${id} already exists.`);
    }

    return this.prisma.sport.create({
      data: {
        id,
        name,
        icon,
        category,
      },
    });
  }

  findAll() {
    return this.prisma.sport.findMany({
      orderBy: {
        category: "asc",
      },
    });
  }

  async findOne(id: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
    });
    if (!sport) {
      throw new NotFoundException(`Sport with ID "${id}" not found`);
    }
    return sport;
  }

  async remove(id: string): Promise<Sport> {
    return this.prisma.sport.delete({ where: { id } });
  }
}
