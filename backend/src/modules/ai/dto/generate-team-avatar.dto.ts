import type { z } from 'zod';
import type { GenerateTeamAvatarInputSchema } from '@/ai/flows/schemas/generate-team-avatar-schema';

export class GenerateTeamAvatarDto implements z.infer<typeof GenerateTeamAvatarInputSchema> {
    readonly prompt: string;
}
