import type { z } from 'zod';
import type { GenerateMatchPostInputSchema } from '../schemas/generate-match-post-schema';

export class GenerateMatchPostDto implements z.infer<typeof GenerateMatchPostInputSchema> {
    readonly winningTeam: string;
    readonly losingTeam: string;
    readonly score: string;
    readonly matchSummary: string;
}
