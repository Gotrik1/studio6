import type { z } from 'zod';
import type { AnalyzeMatchChallengeInputSchema } from '@/ai/flows/schemas/analyze-match-challenge-schema';

export class AnalyzeMatchChallengeDto {
    readonly input: z.infer<typeof AnalyzeMatchChallengeInputSchema>;
}
