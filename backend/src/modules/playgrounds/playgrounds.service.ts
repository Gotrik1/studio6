import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Playground } from '@prisma/client';
import { CreatePlaygroundDto } from './dto/create-playground.dto';

@Injectable()
export class PlaygroundsService {
  constructor(private prisma: PrismaService) {}

  async create(createPlaygroundDto: CreatePlaygroundDto, creatorId: string): Promise<Playground> {
    return this.prisma.playground.create({
      data: {
        ...createPlaygroundDto,
        creator: { connect: { id: creatorId } },
        rating: 0, // Initial rating
        checkIns: 0, // Initial check-ins
        status: 'PENDING_MODERATION',
      },
    });
  }

  async findAll(): Promise<Playground[]> {
    return this.prisma.playground.findMany({
      where: { status: 'APPROVED' },
      include: { creator: { select: { name: true, avatar: true } } },
    });
  }

  async findOne(id: string): Promise<Playground> {
    const playground = await this.prisma.playground.findUnique({
      where: { id },
      include: { creator: { select: { name: true, avatar: true } } },
    });
    if (!playground) {
      throw new NotFoundException(`Playground with ID ${id} not found`);
    }
    return playground;
  }
  
  async findAllForAdmin(): Promise<Playground[]> {
    return this.prisma.playground.findMany({
        include: { creator: { select: { name: true, avatar: true } } },
    });
  }

  async approve(id: string): Promise<Playground> {
      return this.prisma.playground.update({
          where: { id },
          data: { status: 'APPROVED' }
      });
  }
  
  async remove(id: string): Promise<Playground> {
      return this.prisma.playground.delete({ where: { id } });
  }
}
