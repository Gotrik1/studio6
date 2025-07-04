import { z } from 'zod';

export const NewsItemSchema = z.object({
    title: z.string().describe("A catchy, short headline for the news item."),
    summary: z.string().describe("A one-sentence summary of the event."),
    category: z.enum(['match', 'team', 'player', 'platform']).describe("The category of the news."),
    href: z.string().describe("A relevant link for the news item, e.g., a team or player profile URL."),
});

export const GeneratePlatformNewsOutputSchema = z.object({
    news: z.array(NewsItemSchema).describe("An array of 3-4 news items about recent platform activity."),
});
export type GeneratePlatformNewsOutput = z.infer<typeof GeneratePlatformNewsOutputSchema>;

export const NewsWithAudioSchema = z.object({
    ...GeneratePlatformNewsOutputSchema.shape,
    audioDataUri: z.string().optional().describe("The generated audio news digest as a data URI."),
});
export type NewsWithAudio = z.infer<typeof NewsWithAudioSchema>;
