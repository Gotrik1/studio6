import type { z } from 'zod';
import type { GenerateTrainingProgramInputSchema } from '@/ai/flows/schemas/generate-training-program-schema';

export class GenerateTrainingProgramDto implements z.infer<typeof GenerateTrainingProgramInputSchema> {
    readonly goal: "Набор массы" | "Снижение веса" | "Рельеф" | "Сила";
    readonly experience: "Новичок" | "Средний" | "Продвинутый";
    readonly daysPerWeek: number;
    readonly gender: "Мужской" | "Женский";
    readonly focus?: string;
}
