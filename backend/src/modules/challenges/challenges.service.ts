import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { Challenge, Role, Prisma } from "@prisma/client";
import { CreateChallengeDto } from "./dto/create-challenge.dto";
import { ChallengeDto } from "./dto/challenge.dto";

@Injectable()
export class ChallengesService implements OnModuleInit {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedChallenges();
  }

  async seedChallenges() {
    const count = await this.prisma.challenge.count();
    if (count > 0) return;

    this.logger.log("Seeding challenges...");

    const users = await this.prisma.user.findMany({
      where: { role: Role.PLAYER },
      take: 2,
    });
    const valorantSport = await this.prisma.sport.findFirst({
      where: { name: "Valorant" },
    });
    const basketballSport = await this.prisma.sport.findFirst({
      where: { name: "Баскетбол" },
    });

    if (users.length < 2 || !valorantSport || !basketballSport) {
      this.logger.warn(
        "Not enough users or sports to seed challenges. Skipping.",
      );
      return;
    }

    await this.prisma.challenge.create({
      data: {
        title: "Дуэль 1 на 1 на AWP",
        description:
          "Ищу сильного снайпера для дуэли на карте awp_lego. Ставка - уважение.",
        wager: 100,
        creator: { connect: { id: users[0].id } },
        discipline: { connect: { id: valorantSport.id } },
        status: "OPEN",
      },
    });

    await this.prisma.challenge.create({
      data: {
        title: "Баскетбольный баттл",
        description: "Кто забьет больше трехочковых из 10 попыток?",
        wager: 50,
        creator: { connect: { id: users[1].id } },
        opponent: { connect: { id: users[0].id } },
        discipline: { connect: { id: basketballSport.id } },
        status: "IN_PROGRESS",
      },
    });

    this.logger.log("Challenges seeded.");
  }

  async create(
    createChallengeDto: CreateChallengeDto,
    userId: string,
  ): Promise<Challenge> {
    const { title, description, wager, disciplineId } = createChallengeDto;
    return this.prisma.challenge.create({
      data: {
        title,
        description,
        wager,
        discipline: { connect: { id: disciplineId } },
        creator: { connect: { id: userId } },
        status: "OPEN",
      },
    });
  }

  async findAll(
    filter: "open" | "my" | "history",
    userId: string,
  ): Promise<ChallengeDto[]> {
    const where: Prisma.ChallengeWhereInput = {};
    const include: Prisma.ChallengeInclude = {
      creator: { select: { id: true, name: true, avatar: true } },
      opponent: { select: { id: true, name: true, avatar: true } },
      discipline: { select: { name: true } },
    };

    if (filter === "open") {
      where.status = "OPEN";
      where.creatorId = { not: userId };
    } else if (filter === "my" && userId) {
      where.OR = [{ creatorId: userId }, { opponentId: userId }];
      where.status = { in: ["OPEN", "IN_PROGRESS"] };
    } else if (filter === "history" && userId) {
      where.OR = [{ creatorId: userId }, { opponentId: userId }];
      where.status = { in: ["COMPLETED", "CANCELLED"] };
    } else {
      throw new BadRequestException("Invalid filter or missing user ID");
    }

    const challenges = await this.prisma.challenge.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
    });

    // Map to frontend-friendly structure
    return challenges.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      discipline: c.discipline.name,
      wager: c.wager,
      status: c.status,
      result: c.result,
      creator: { ...c.creator, avatarHint: "player avatar" },
      opponent: c.opponent
        ? { ...c.opponent, avatarHint: "player avatar" }
        : null,
    }));
  }

  async accept(challengeId: string, userId: string): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Вызов с ID ${challengeId} не найден.`);
    }

    if (challenge.status !== "OPEN") {
      throw new ForbiddenException("Этот вызов уже неактивен.");
    }

    if (challenge.creatorId === userId) {
      throw new ForbiddenException("Вы не можете принять собственный вызов.");
    }

    // In a real app, you'd also check if both players have enough PD for the wager

    return this.prisma.challenge.update({
      where: { id: challengeId },
      data: {
        opponentId: userId,
        status: "IN_PROGRESS",
      },
    });
  }
}
