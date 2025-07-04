import type { z } from 'zod';
import type { PlayerScoutInputSchema } from '@/ai/flows/schemas/player-scout-schema';

export class PlayerScoutDto {
    readonly input: z.infer<typeof PlayerScoutInputSchema>;
}
