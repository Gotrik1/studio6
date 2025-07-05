import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { faqCategories } from './seed-data';

@Injectable()
export class FaqService implements OnModuleInit {
    private readonly logger = new Logger(FaqService.name);

    constructor(private prisma: PrismaService) {}

    async onModuleInit() {
        await this.seedFaqItems();
    }
    
    async seedFaqItems() {
        const count = await this.prisma.faqItem.count();
        if (count > 0) return;

        this.logger.log('Seeding FAQ items...');
        for (const category of faqCategories) {
            for (const question of category.questions) {
                await this.prisma.faqItem.create({
                    data: {
                        category: category.title,
                        question: question.q,
                        answer: question.a,
                    }
                });
            }
        }
        this.logger.log('FAQ items seeded successfully.');
    }

    async findAllGroupedByCategory() {
        const items = await this.prisma.faqItem.findMany({
            orderBy: { createdAt: 'asc' },
        });

        const grouped = items.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = {
                    title: category,
                    value: category.toLowerCase().replace(/\s/g, '-'),
                    questions: []
                };
            }
            acc[category].questions.push({ q: item.question, a: item.answer });
            return acc;
        }, {} as Record<string, { title: string; value: string; questions: { q: string, a: string }[] }>);

        return Object.values(grouped);
    }
}
