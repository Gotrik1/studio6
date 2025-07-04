import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Promotion } from '@prisma/client';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePromotionDto & { organizerId: string }): Promise<Promotion> {
    return this.prisma.promotion.create({
      data: {
        name: data.name,
        description: data.description,
        prize: data.prize,
        cost: data.cost,
        imageDataUri: data.imageDataUri,
        imageHint: data.imageHint,
        endDate: data.endDate,
        organizer: { connect: { id: data.organizerId } },
        sponsor: data.sponsorId ? { connect: { id: data.sponsorId } } : undefined,
      },
    });
  }

  async findAll(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      include: {
        sponsor: { select: { name: true, logo: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
