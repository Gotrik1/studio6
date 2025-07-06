
import type { z } from 'zod';
import type { GenerateSocialMediaPostInputSchema } from '@/ai/flows/schemas/generate-social-media-post-schema';

export class GenerateSocialMediaPostDto implements z.infer<typeof GenerateSocialMediaPostInputSchema> {
    readonly teamName: string;
    readonly postType: 'match_announcement' | 'player_highlight' | 'general_update';
    readonly context: string;
}
