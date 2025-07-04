import type { z } from 'zod';
import type { CreateTeamInputSchema } from '@/ai/flows/schemas/create-team-schema';

export class CreateTeamDto implements z.infer<typeof CreateTeamInputSchema> {
    readonly description: string;
}
