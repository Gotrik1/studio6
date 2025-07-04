import type { z } from 'zod';
import type { GenerateContentInputSchema } from '@/ai/flows/schemas/generate-content-schema';

export class GenerateContentDto implements z.infer<typeof GenerateContentInputSchema> {
    readonly topic: string;
    readonly tone: string;
    readonly contentType: string;
}
