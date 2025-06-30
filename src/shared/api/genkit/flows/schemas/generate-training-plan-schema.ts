
import { z } from 'zod';

export const DrillSchema = z.object({
  name: z.string().describe('Название конкретного упражнения или тренировочного фокуса.'),
  duration: z.string().describe('Рекомендуемая продолжительность или количество подходов/повторений.'),
  description: z.string().describe('Краткое описание, как выполнять упражнение и на что обратить внимание.'),
});

export const GenerateTrainingPlanInputSchema = z.object({
  analysis: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  }),
  fitnessGoal: z.string().describe("The user's primary fitness goal, e.g., \"Набор массы\", \"Сила\"."),
});
export type GenerateTrainingPlanInput = z.infer<typeof GenerateTrainingPlanInputSchema>;


export const GenerateTrainingPlanOutputSchema = z.object({
  weeklyFocus: z.string().describe('Основной фокус тренировок на предстоящую неделю, основанный на анализе слабых сторон.'),
  drills: z.array(DrillSchema).describe('Список из 2-3 конкретных упражнений (drills) для отработки.'),
  suggestedVideos: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
  })).describe('Список из 1-2 ссылок на полезные видео-гайды на YouTube по теме.'),
  weeklyGoal: z.string().describe('Конкретная, измеримая цель на неделю.'),
});
export type GenerateTrainingPlanOutput = z.infer<typeof GenerateTrainingPlanOutputSchema>;
