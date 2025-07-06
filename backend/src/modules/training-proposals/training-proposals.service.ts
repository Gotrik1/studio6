import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateTrainingProposalDto } from "./dto/create-training-proposal.dto";
import { UpdateTrainingProposalDto } from "./dto/update-training-proposal.dto";

@Injectable()
export class TrainingProposalsService {
  constructor(private prisma: PrismaService) {}

  async create(fromId: string, createDto: CreateTrainingProposalDto) {
    return this.prisma.trainingProposal.create({
      data: {
        fromId,
        toId: createDto.toId,
        sport: createDto.sport,
        date: createDto.date,
        comment: createDto.comment,
        program: createDto.programId
          ? { connect: { id: createDto.programId } }
          : undefined,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.trainingProposal.findMany({
      where: {
        OR: [{ fromId: userId }, { toId: userId }],
      },
      include: {
        from: { select: { id: true, name: true, avatar: true } },
        to: { select: { id: true, name: true, avatar: true } },
        program: { select: { id: true, name: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateStatus(
    userId: string,
    proposalId: string,
    updateDto: UpdateTrainingProposalDto,
  ) {
    const proposal = await this.prisma.trainingProposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new NotFoundException("Предложение не найдено.");
    }

    if (proposal.toId !== userId) {
      throw new ForbiddenException(
        "Вы не можете изменить статус этого предложения.",
      );
    }

    return this.prisma.trainingProposal.update({
      where: { id: proposalId },
      data: { status: updateDto.status },
    });
  }
}
