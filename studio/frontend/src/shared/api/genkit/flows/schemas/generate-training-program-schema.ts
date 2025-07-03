
import { z } from 'zod';

export const ExerciseDetailSchema = z.object({
  name: z.string().describe('Название упражнения.'),
  sets: z.string().describe('Количество подходов, например "3-4".'),
  reps: z.string().describe('Количество повторений, например "8-12".'),
});

export const WorkoutDaySchema = z.object({
  day: z.number().describe('Порядковый номер дня в неделе (1-7).'),
  title: z.string().describe('Название тренировочного дня, например "Грудь и Трицепс".'),
  exercises: z.array(ExerciseDetailSchema).describe('Список упражнений на этот день.'),
});

export const GenerateTrainingProgramInputSchema = z.object({
  goal: z.enum(['Набор массы', 'Снижение веса', 'Рельеф', 'Сила']).describe('Основная цель программы.'),
  experience: z.enum(['Новичок', 'Средний', 'Продвинутый']).describe('Уровень подготовки атлета.'),
  daysPerWeek: z.number().min(1).max(7).describe('Сколько дней в неделю атлет готов тренироваться.'),
  gender: z.enum(['Мужской', 'Женский']).describe('Пол атлета для подбора фокуса.'),
  focus: z.string().optional().describe('Дополнительный фокус, например "акцент на ноги" или "убрать живот".'),
});
export type GenerateTrainingProgramInput = z.infer<typeof GenerateTrainingProgramInputSchema>;

export const GenerateTrainingProgramOutputSchema = z.object({
  name: z.string().describe('Креативное название для сгенерированной программы.'),
  description: z.string().describe('Краткое описание программы, ее целей и для кого она подходит.'),
  weeklySplit: z.array(WorkoutDaySchema).describe('Полная программа тренировок, расписанная по дням.'),
});
export type GenerateTrainingProgramOutput = z.infer<typeof GenerateTrainingProgramOutputSchema>;
