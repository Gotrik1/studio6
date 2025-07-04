import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { StoreItem } from '@prisma/client';

@Injectable()
export class StoreService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<StoreItem[]> {
        const items = await this.prisma.storeItem.findMany();
        
        // Simple seeding logic
        if (items.length === 0) {
            return this.prisma.$transaction([
                this.prisma.storeItem.create({ data: { name: 'PRO Подписка (1 месяц)', description: 'Разблокируйте эксклюзивные функции: глубокий AI-анализ, кастомные аватары и значок PRO.', price: 500, image: 'https://placehold.co/600x400.png', imageHint: 'gold medal icon', category: 'Подписки', isRealMoney: false } }),
                this.prisma.storeItem.create({ data: { name: 'Буст ранга (x2 на 7 дней)', description: 'Удвойте получаемые очки рейтинга за победы в течение одной недели.', price: 350, image: 'https://placehold.co/600x400.png', imageHint: 'arrow up chart', category: 'Бустеры', isRealMoney: false } }),
                this.prisma.storeItem.create({ data: { name: 'Рамка аватара "Пламя"', description: 'Покажите всем свой огонь с этой эксклюзивной анимированной рамкой для аватара.', price: 250, image: 'https://placehold.co/600x400.png', imageHint: 'fire frame icon', category: 'Кастомизация', isRealMoney: false } }),
                this.prisma.storeItem.create({ data: { name: 'Набор PD (500)', description: 'Пополните свой баланс на 500 PD.', price: 4.99, image: 'https://placehold.co/600x400.png', imageHint: 'coin stack', category: 'Валюта', isRealMoney: true } }),
                this.prisma.storeItem.create({ data: { name: 'Смена никнейма', description: 'Измените ваш никнейм на платформе. Доступно раз в 30 дней.', price: 150, image: 'https://placehold.co/600x400.png', imageHint: 'pencil signature', category: 'Услуги', isRealMoney: false } }),
            ]);
        }
        
        return items;
    }
}
