import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { sportsList } from './seed-data';

@Injectable()
export class SportsService implements OnModuleInit {
  private readonly logger = new Logger(SportsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSports();
  }

  async seedSports() {
    const count = await this.prisma.sport.count();
    if (count === 0) {
      this.logger.log('Seeding sports...');
      await this.prisma.sport.createMany({
        data: sportsList,
        skipDuplicates: true,
      });
      this.logger.log('Sports seeded successfully.');
    }
  }

  findAll() {
    return this.prisma.sport.findMany();
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
}
