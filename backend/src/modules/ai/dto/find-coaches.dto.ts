import type { z } from 'zod';
import type { FindCoachesInputSchema } from '@/ai/flows/schemas/find-coaches-schema';

export class FindCoachesDto {
    readonly input: z.infer<typeof FindCoachesInputSchema>;
}
