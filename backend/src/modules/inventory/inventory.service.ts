import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, createDto: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        ...createDto,
        purchaseDate: new Date(createDto.purchaseDate),
        user: { connect: { id: userId } },
      },
    });
  }

  async remove(id: string, userId: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Предмет с ID ${id} не найден.`);
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Вы не можете удалить чужой предмет.');
    }

    return this.prisma.inventoryItem.delete({ where: { id } });
  }
}
