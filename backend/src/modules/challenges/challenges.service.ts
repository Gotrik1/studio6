import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Challenge, ChallengeStatus } from '@prisma/client';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async create(createChallengeDto: CreateChallengeDto, userId: string): Promise<Challenge> {
    const { title, description, wager, disciplineId } = createChallengeDto;
    return this.prisma.challenge.create({
      data: {
        title,
        description,
        wager,
        discipline: { connect: { id: disciplineId } },
        creatorId: userId,
        status: 'OPEN',
      },
    });
  }

  async findAll(filter: 'open' | 'my' | 'history', userId: string): Promise<any[]> {
    const where: any = {};
    const include = {
        creator: { select: { id: true, name: true, avatar: true } },
        opponent: { select: { id: true, name: true, avatar: true } },
        discipline: { select: { name: true } },
    };

    if (filter === 'open') {
        where.status = 'OPEN';
        where.creatorId = { not: userId };
    } else if (filter === 'my' && userId) {
        where.OR = [
            { creatorId: userId },
            { opponentId: userId }
        ];
        where.status = { in: ['OPEN', 'IN_PROGRESS'] };
    } else if (filter === 'history' && userId) {
        where.OR = [
            { creatorId: userId },
            { opponentId: userId }
        ];
        where.status = { in: ['COMPLETED', 'CANCELLED'] };
    } else {
       throw new BadRequestException('Invalid filter or missing user ID');
    }

    const challenges = await this.prisma.challenge.findMany({ where, include, orderBy: { createdAt: 'desc' } });
    
    // Map to frontend-friendly structure
    return challenges.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        discipline: c.discipline.name,
        wager: c.wager,
        status: c.status,
        result: c.result,
        creator: { ...c.creator, avatarHint: 'player avatar' },
        opponent: c.opponent ? { ...c.opponent, avatarHint: 'player avatar' } : null,
    }));
  }

  async accept(challengeId: string, userId: string): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Вызов с ID ${challengeId} не найден.`);
    }

    if (challenge.status !== 'OPEN') {
      throw new ForbiddenException('Этот вызов уже неактивен.');
    }

    if (challenge.creatorId === userId) {
      throw new ForbiddenException('Вы не можете принять собственный вызов.');
    }
    
    // In a real app, you'd also check if both players have enough PD for the wager
    
    return this.prisma.challenge.update({
      where: { id: challengeId },
      data: {
        opponentId: userId,
        status: 'IN_PROGRESS',
      },
    });
  }
}
