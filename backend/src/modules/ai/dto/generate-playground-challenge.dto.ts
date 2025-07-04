import type { z } from 'zod';
import type { GeneratePlaygroundChallengeInputSchema } from '@/ai/flows/schemas/generate-playground-challenge-schema';

export class GeneratePlaygroundChallengeDto implements z.infer<typeof GeneratePlaygroundChallengeInputSchema> {
    readonly playgroundName: string;
    readonly playgroundType: string;
    readonly topPlayerName: string;
    readonly topPlayerStat: string;
}
