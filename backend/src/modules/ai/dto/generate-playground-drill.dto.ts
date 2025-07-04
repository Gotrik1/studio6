import type { z } from 'zod';
import type { GeneratePlaygroundDrillInputSchema } from '@/ai/flows/schemas/generate-playground-drill-schema';

export class GeneratePlaygroundDrillDto implements z.infer<typeof GeneratePlaygroundDrillInputSchema> {
    readonly userWeakness: string;
    readonly playgroundType: string;
}
