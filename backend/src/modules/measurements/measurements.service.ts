import { Injectable } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MeasurementsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, createMeasurementDto: CreateMeasurementDto) {
    return this.prisma.measurement.create({
      data: {
        ...createMeasurementDto,
        date: new Date(createMeasurementDto.date),
        user: { connect: { id: userId } },
      },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }
}
