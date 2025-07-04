import type { z } from 'zod';
import type { FindSponsorsForTeamInputSchema } from '@/ai/flows/schemas/find-sponsors-for-team-schema';

export class FindSponsorsForTeamDto implements z.infer<typeof FindSponsorsForTeamInputSchema> {
    readonly teamName: string;
    readonly teamGame: string;
    readonly teamDescription: string;
}
