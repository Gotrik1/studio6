import type { z } from 'zod';
import type { PlayerScoutInputSchema } from '@/ai/flows/schemas/player-scout-schema';

export class PlayerScoutDto implements z.infer<typeof PlayerScoutInputSchema> {
    readonly input: string;
}
