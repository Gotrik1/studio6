import type { z } from 'zod';
import type { GeneratePromotionWizardInputSchema } from '@/ai/flows/schemas/generate-promotion-wizard-schema';

export class GeneratePromotionWizardDto implements z.infer<typeof GeneratePromotionWizardInputSchema> {
    readonly prompt: string;
}
