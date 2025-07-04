import type { z } from 'zod';
import type { FindLfgLobbiesInputSchema } from '@/ai/flows/schemas/find-lfg-lobbies-schema';

export class FindLfgLobbiesDto {
    readonly input: z.infer<typeof FindLfgLobbiesInputSchema>;
}
