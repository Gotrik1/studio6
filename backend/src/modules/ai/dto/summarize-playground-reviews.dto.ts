import type { z } from 'zod';
import type { SummarizePlaygroundReviewsInputSchema } from '@/ai/flows/schemas/summarize-playground-reviews-schema';

export class SummarizePlaygroundReviewsDto implements z.infer<typeof SummarizePlaygroundReviewsInputSchema> {
    readonly reviews: string[];
}
