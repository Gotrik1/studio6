
import { z } from 'zod';

export const GenerateTrainingProgramInputSchema = z.object({
  goal: z.enum(['Набор массы', 'Снижение веса', 'Рельеф', 'Сила']),
  experience: z.enum(['Новичок', 'Опытный', 'Профи']),
  daysPerWeek: z.number().min(2).max(5),
  gender: z.enum(['Мужской', 'Женский']),
  focus: z.enum(['Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Нет']),
});
export type GenerateTrainingProgramInput = z.infer<typeof GenerateTrainingProgramInputSchema>;

const ExerciseSchema = z.object({
    name: z.string().describe("Название упражнения."),
    sets: z.string().describe("Рекомендуемое количество подходов и повторений, например '4x8-12'."),
});

const WorkoutDaySchema = z.object({
    day: z.string().describe("Название дня тренировки, например 'День 1: Грудь и Трицепс'."),
    exercises: z.array(ExerciseSchema).describe("Список упражнений на этот день."),
});

export const GenerateTrainingProgramOutputSchema = z.object({
  programName: z.string().describe("Креативное и подходящее название для сгенерированной программы."),
  description: z.string().describe("Краткое объяснение, почему была выбрана именно эта структура тренировок и как она поможет достичь цели."),
  weeklySplit: z.array(WorkoutDaySchema).describe("Массив тренировочных дней, составляющих недельный сплит."),
});
export type GenerateTrainingProgramOutput = z.infer<typeof GenerateTrainingProgramOutputSchema>;
