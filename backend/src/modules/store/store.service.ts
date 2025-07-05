import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { StoreItem } from '@prisma/client';

@Injectable()
export class StoreService implements OnModuleInit {
    constructor(private prisma: PrismaService) {}

    async onModuleInit() {
        const count = await this.prisma.storeItem.count();
        if (count === 0) {
            await this.seedItems();
        }
    }

    async findAll(): Promise<StoreItem[]> {
        return this.prisma.storeItem.findMany();
    }
    
    async seedItems(): Promise<void> {
        await this.prisma.storeItem.createMany({
            data: [
                { name: 'PRO Подписка (1 месяц)', description: 'Разблокируйте эксклюзивные функции: глубокий AI-анализ, кастомные аватары и значок PRO.', price: 500, image: 'https://placehold.co/600x400.png', imageHint: 'gold medal icon', category: 'Подписки', isRealMoney: false },
                { name: 'Буст ранга (x2 на 7 дней)', description: 'Удвойте получаемые очки рейтинга за победы в течение одной недели.', price: 350, image: 'https://placehold.co/600x400.png', imageHint: 'arrow up chart', category: 'Бустеры', isRealMoney: false },
                { name: 'Рамка аватара "Пламя"', description: 'Покажите всем свой огонь с этой эксклюзивной анимированной рамкой для аватара.', price: 250, image: 'https://placehold.co/600x400.png', imageHint: 'fire frame icon', category: 'Кастомизация', isRealMoney: false },
                { name: 'Набор PD (500)', description: 'Пополните свой баланс на 500 PD.', price: 4.99, image: 'https://placehold.co/600x400.png', imageHint: 'coin stack', category: 'Валюта', isRealMoney: true },
                { name: 'Смена никнейма', description: 'Измените ваш никнейм на платформе. Доступно раз в 30 дней.', price: 150, image: 'https://placehold.co/600x400.png', imageHint: 'pencil signature', category: 'Услуги', isRealMoney: false },
            ],
            skipDuplicates: true,
        });
    }
}
