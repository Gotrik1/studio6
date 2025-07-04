import type { z } from 'zod';
import type { GeneratePlaygroundLoreInputSchema } from '@/ai/flows/schemas/generate-playground-lore-schema';

export class GeneratePlaygroundLoreDto implements z.infer<typeof GeneratePlaygroundLoreInputSchema> {
    readonly playgroundName: string;
    readonly topPlayer: string;
    readonly topTeam: string;
    readonly checkIns: number;
}
