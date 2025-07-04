import type { z } from 'zod';
import type { AiTeamAssistantInputSchema } from '@/ai/flows/schemas/ai-team-assistant-schema';

export class AiTeamAssistantDto implements z.infer<typeof AiTeamAssistantInputSchema> {
    readonly teamActivity: string;
    readonly teamGoals: string;
    readonly relevantContent?: string;
}
