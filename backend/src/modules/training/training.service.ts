
import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { exercisesList } from "./seed-data";
import { trainingPrograms as mockPrograms } from "./seed-data-programs";
import type { Exercise, TrainingProgram } from "@prisma/client";
import { AssignProgramDto } from "./dto/assign-program.dto";
import type { CreateProgramData, UpdateProgramData } from "./dto/program.dto";

// Define a type for the transformed exercise to ensure type safety
type TransformedExercise = Omit<
  Exercise,
  "techniqueTips" | "commonMistakes" | "alternatives"
> & {
  techniqueTips: string[];
  commonMistakes: string[];
  alternatives: string[];
};

const transformExercise = (exercise: Exercise): TransformedExercise => {
  return {
    ...exercise,
    techniqueTips: Array.isArray(exercise.techniqueTips)
      ? (exercise.techniqueTips as string[])
      : [],
    commonMistakes: Array.isArray(exercise.commonMistakes)
      ? (exercise.commonMistakes as string[])
      : [],
    alternatives: Array.isArray(exercise.alternatives)
      ? (exercise.alternatives as string[])
      : [],
  };
};

@Injectable()
export class TrainingService implements OnModuleInit {
  private readonly logger = new Logger(TrainingService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedExercises();
    await this.seedTrainingPrograms();
    await this.seedTrainingLogs();
  }

  async seedExercises() {
    const count = await this.prisma.exercise.count();
    if (count === 0) {
      this.logger.log("Seeding exercises...");
      await this.prisma.exercise.createMany({
        data: exercisesList.map((item) => ({
          name: item.name,
          description: item.description,
          category: item.category,
          equipment: item.equipment,
          image: item.image,
          imageHint: item.imageHint,
          videoUrl: item.videoUrl,
          techniqueTips: item.techniqueTips,
          commonMistakes: item.commonMistakes,
          alternatives: item.alternatives,
        })),
        skipDuplicates: true,
      });
      this.logger.log("Exercises seeded successfully.");
    }
  }

  async seedTrainingPrograms() {
    const count = await this.prisma.trainingProgram.count();
    if (count > 0) return;

    this.logger.log("Seeding training programs...");
    for (const program of mockPrograms) {
      await this.prisma.trainingProgram.create({
        data: {
          id: program.id, // Use mock ID for consistency
          name: program.name,
          description: program.description,
          goal: program.goal,
          daysPerWeek: program.daysPerWeek,
          splitType: program.splitType,
          author: program.author,
          coverImage: program.coverImage,
          coverImageHint: program.coverImageHint,
          isAiGenerated: program.isAiGenerated || false,
          weeklySplit: {
            create: program.weeklySplit.map((day) => ({
              day: day.day,
              title: day.title,
              exercises: {
                create: day.exercises.map((ex) => ({
                  name: ex.name,
                  sets: ex.sets,
                  reps: ex.reps,
                  plannedWeight: ex.plannedWeight,
                  isSupersetWithPrevious: ex.isSupersetWithPrevious,
                  technique: ex.technique,
                })),
              },
            })),
          },
        },
      });
    }
    this.logger.log("Training programs seeded successfully.");
  }

  async seedTrainingLogs() {
    const logCount = await this.prisma.trainingLog.count();
    if (logCount > 0) return;

    this.logger.log("Seeding initial training logs...");

    const user = await this.prisma.user.findFirst();
    if (!user) {
      this.logger.warn("No user found to seed training logs for. Skipping.");
      return;
    }

    const exercises = await this.prisma.exercise.findMany({ take: 5 });
    if (exercises.length < 3) {
      this.logger.warn("Not enough exercises to seed training logs. Skipping.");
      return;
    }

    const log = await this.prisma.trainingLog.create({
      data: {
        userId: user.id,
        date: new Date("2024-08-01"),
        workoutName: "День 1: Грудь и трицепс",
        status: "COMPLETED",
        mood: "GREAT",
        notes: "Отличная тренировка, чувствую прогресс в жиме.",
        coachNotes: "Молодец! Следи за техникой в последнем подходе жима лежа.",
      },
    });

    const loggedExercise1 = await this.prisma.loggedExercise.create({
      data: {
        trainingLogId: log.id,
        exerciseId: exercises[0].id, // Жим лежа
        notes: "Попробовать свести лопатки сильнее в следующий раз.",
      },
    });

    await this.prisma.loggedSet.createMany({
      data: [
        {
          loggedExerciseId: loggedExercise1.id,
          plannedReps: "8",
          plannedWeight: "80 кг",
          loggedReps: 8,
          loggedWeight: 80,
          rpe: 7,
          isCompleted: true,
        },
        {
          loggedExerciseId: loggedExercise1.id,
          plannedReps: "8",
          plannedWeight: "80 кг",
          loggedReps: 8,
          loggedWeight: 80,
          rpe: 8,
          isCompleted: true,
        },
      ],
    });

    this.logger.log("Initial training logs seeded.");
  }

  async findAllExercises(): Promise<TransformedExercise[]> {
    const exercises = await this.prisma.exercise.findMany();
    return exercises.map(transformExercise);
  }

  async findOneExercise(id: string): Promise<TransformedExercise> {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found.`);
    }
    return transformExercise(exercise);
  }

  async findAllPrograms() {
    return this.prisma.trainingProgram.findMany({
      include: {
        weeklySplit: {
          orderBy: { day: "asc" },
          include: {
            exercises: true,
          },
        },
      },
    });
  }

  async createProgram(
    data: CreateProgramData,
    authorName: string,
  ): Promise<TrainingProgram> {
    const { weeklySplit, ...programData } = data;
    return this.prisma.trainingProgram.create({
      data: {
        ...programData,
        description: programData.description || "",
        id: `manual-${Date.now()}`,
        author: authorName,
        isAiGenerated: false,
        daysPerWeek: weeklySplit.length,
        coverImage: "https://placehold.co/600x400.png",
        coverImageHint: "gym weights",
        weeklySplit: {
          create: weeklySplit.map((day) => ({
            day: day.day,
            title: day.title,
            exercises: {
              create: day.exercises.map((ex) => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                plannedWeight: ex.plannedWeight,
                isSupersetWithPrevious: ex.isSupersetWithPrevious,
                technique: ex.technique,
              })),
            },
          })),
        },
      },
    });
  }

  async updateProgram(
    id: string,
    data: UpdateProgramData,
  ): Promise<TrainingProgram> {
    const { weeklySplit, ...programData } = data;

    return this.prisma.$transaction(async (tx) => {
      const existingProgram = await tx.trainingProgram.findUnique({
        where: { id },
        include: { weeklySplit: { include: { exercises: true } } },
      });

      if (!existingProgram) {
        throw new NotFoundException(`Program with ID ${id} not found.`);
      }

      for (const day of existingProgram.weeklySplit) {
        await tx.workoutExercise.deleteMany({ where: { workoutDayId: day.id } });
      }
      await tx.workoutDay.deleteMany({ where: { trainingProgramId: id } });

      return tx.trainingProgram.update({
        where: { id },
        data: {
          ...programData,
          description: programData.description || "",
          daysPerWeek: weeklySplit.length,
          weeklySplit: {
            create: weeklySplit.map((day) => ({
              day: day.day,
              title: day.title,
              exercises: {
                create: day.exercises.map((ex) => ({
                  name: ex.name,
                  sets: ex.sets,
                  reps: ex.reps,
                  plannedWeight: ex.plannedWeight,
                  isSupersetWithPrevious: ex.isSupersetWithPrevious,
                  technique: ex.technique,
                })),
              },
            })),
          },
        },
      });
    });
  }

  async deleteProgram(id: string): Promise<TrainingProgram> {
    return this.prisma.trainingProgram.delete({ where: { id } });
  }

  async getLogsForUser(userId: string) {
    return this.prisma.trainingLog.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  async assignProgram(assignProgramDto: AssignProgramDto) {
    const { programId, playerIds } = assignProgramDto;

    const assignments = playerIds.map((playerId) => ({
      userId: playerId,
      programId: programId,
    }));

    await this.prisma.userTrainingProgram.updateMany({
      where: {
        userId: { in: playerIds },
      },
      data: {
        isActive: false,
      },
    });
    
    await this.prisma.userTrainingProgram.createMany({
        data: assignments,
        skipDuplicates: true
    });
    
    return { success: true, message: "Program assigned successfully" };
  }
}
