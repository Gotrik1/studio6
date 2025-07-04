import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { exercisesList } from './seed-data';

@Injectable()
export class TrainingService implements OnModuleInit {
    private readonly logger = new Logger(TrainingService.name);

    constructor(private prisma: PrismaService) {}

    async onModuleInit() {
        await this.seedExercises();
    }
    
    async seedExercises() {
        const count = await this.prisma.exercise.count();
        if (count === 0) {
            this.logger.log('Seeding exercises...');
            await this.prisma.exercise.createMany({
                data: exercisesList.map(({ id, ...rest }) => rest), // Exclude mock ID
                skipDuplicates: true,
            });
            this.logger.log('Exercises seeded successfully.');
        }
    }

    async findAllExercises() {
        return this.prisma.exercise.findMany();
    }

    async findAllPrograms() {
        // This is a placeholder. In a real app, you would fetch programs from the database.
        // For now, we return an empty array as the frontend will use its context provider
        // which now fetches from here.
        return [];
    }
}
