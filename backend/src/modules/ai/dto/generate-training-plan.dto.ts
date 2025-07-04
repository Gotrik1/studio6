import type { z } from 'zod';
import type { GenerateTrainingPlanInputSchema } from '@/ai/flows/schemas/generate-training-plan-schema';

export class GenerateTrainingPlanDto implements z.infer<typeof GenerateTrainingPlanInputSchema> {
    readonly analysis: {
        strengths: string[];
        weaknesses: string[];
    };
    readonly fitnessGoal: string;
}
