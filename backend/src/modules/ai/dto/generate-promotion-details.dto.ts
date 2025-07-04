import type { z } from 'zod';
import type { GeneratePromotionDetailsInputSchema } from '@/ai/flows/schemas/generate-promotion-details-schema';

export class GeneratePromotionDetailsDto implements z.infer<typeof GeneratePromotionDetailsInputSchema> {
    readonly prompt: string;
}
