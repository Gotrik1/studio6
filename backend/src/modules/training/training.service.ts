import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { exercisesList } from './seed-data';

@Injectable()
export class TrainingService implements OnModuleInit {
    private readonly logger = new Logger(TrainingService.name);

    constructor(private prisma: PrismaService) {}

    async onModuleInit() {
        await this.seedExercises();
        await this.seedTrainingLogs();
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

    async seedTrainingLogs() {
        const logCount = await this.prisma.trainingLog.count();
        if (logCount > 0) return;

        this.logger.log('Seeding initial training logs...');
        
        const user = await this.prisma.user.findFirst();
        if (!user) {
            this.logger.warn('No user found to seed training logs for. Skipping.');
            return;
        }

        const exercises = await this.prisma.exercise.findMany({ take: 5 });
        if (exercises.length < 3) {
            this.logger.warn('Not enough exercises to seed training logs. Skipping.');
            return;
        }

        const log = await this.prisma.trainingLog.create({
            data: {
                userId: user.id,
                date: new Date('2024-08-01'),
                workoutName: 'День 1: Грудь и трицепс',
                status: 'completed',
                mood: 'great',
                notes: 'Отличная тренировка, чувствую прогресс в жиме.',
                coachNotes: 'Молодец! Следи за техникой в последнем подходе жима лежа.'
            }
        });

        const loggedExercise1 = await this.prisma.loggedExercise.create({
            data: {
                trainingLogId: log.id,
                exerciseId: exercises[0].id, // Жим лежа
                notes: 'Попробовать свести лопатки сильнее в следующий раз.'
            }
        });

        await this.prisma.loggedSet.createMany({
            data: [
                { loggedExerciseId: loggedExercise1.id, plannedReps: '8', plannedWeight: '80 кг', loggedReps: 8, loggedWeight: 80, rpe: 7, isCompleted: true },
                { loggedExerciseId: loggedExercise1.id, plannedReps: '8', plannedWeight: '80 кг', loggedReps: 8, loggedWeight: 80, rpe: 8, isCompleted: true },
            ]
        });

         this.logger.log('Initial training logs seeded.');
    }

    async findAllExercises() {
        return this.prisma.exercise.findMany();
    }

    async findAllPrograms() {
        // This is a placeholder. In a real app, you would fetch programs from the database.
        return [];
    }

    async getLogsForUser(userId: string) {
        return this.prisma.trainingLog.findMany({
            where: { userId },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                        sets: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
    }
}
