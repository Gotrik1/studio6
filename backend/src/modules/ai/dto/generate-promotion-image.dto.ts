import type { z } from 'zod';
import type { GeneratePromotionImageInputSchema } from '@/ai/flows/schemas/generate-promotion-image-schema';

export class GeneratePromotionImageDto {
    readonly prompt: z.infer<typeof GeneratePromotionImageInputSchema>;
}
