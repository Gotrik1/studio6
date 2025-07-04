import type { z } from 'zod';
import type { GenerateNutritionPlanInputSchema } from '@/ai/flows/schemas/generate-nutrition-plan-schema';

export class GenerateNutritionPlanDto implements z.infer<typeof GenerateNutritionPlanInputSchema> {
    readonly goal: 'Набор массы' | 'Снижение веса' | 'Поддержание веса';
    readonly activityLevel: 'Низкий' | 'Средний' | 'Высокий';
    readonly dietaryPreferences?: string;
}
