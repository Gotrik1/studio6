import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

const mainPoll = {
  id: "poll-1",
  title: "Еженедельный опрос",
  question: "Какую новую фичу вы бы хотели видеть на платформе?",
  options: [
    { id: "opt-1", text: "Система лиг с дивизионами" },
    { id: "opt-2", text: "Конструктор тактик на карте" },
    { id: "opt-3", text: "Прямые трансляции матчей" },
    { id: "opt-4", text: "Более глубокая статистика" },
  ],
};

@Injectable()
export class PollsService implements OnModuleInit {
  private readonly logger = new Logger(PollsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedPolls();
  }

  async seedPolls() {
    const count = await this.prisma.poll.count();
    if (count > 0) return;

    this.logger.log("Seeding initial poll...");
    await this.prisma.poll.create({
      data: {
        id: mainPoll.id,
        title: mainPoll.title,
        question: mainPoll.question,
        options: {
          create: mainPoll.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          })),
        },
      },
    });
    this.logger.log("Initial poll seeded.");
  }

  async getLatestActivePoll() {
    const poll = await this.prisma.poll.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            _count: {
              select: { votes: true },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!poll) {
      throw new NotFoundException("Активных опросов не найдено.");
    }

    // Transform the data to match the frontend expectations
    return {
      id: poll.id,
      title: poll.title,
      question: poll.question,
      totalVotes: poll._count.votes,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votes: opt._count.votes,
      })),
    };
  }

  async vote({
    userId,
    pollId,
    optionId,
  }: {
    userId: string;
    pollId: string;
    optionId: string;
  }) {
    // Check if user already voted
    const existingVote = await this.prisma.pollVote.findUnique({
      where: { userId_pollId: { userId, pollId } },
    });

    if (existingVote) {
      throw new ConflictException("Вы уже голосовали в этом опросе.");
    }

    // Check if option belongs to poll
    const option = await this.prisma.pollOption.findFirst({
      where: { id: optionId, pollId: pollId },
    });

    if (!option) {
      throw new NotFoundException("Опция не найдена в этом опросе.");
    }

    return this.prisma.pollVote.create({
      data: {
        userId,
        pollId,
        pollOptionId: optionId,
      },
    });
  }
}
