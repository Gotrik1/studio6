
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { teams } from '@/lib/mock-data/teams';
import { leaderboardData } from '@/lib/mock-data/leaderboards';

const NewsItemSchema = z.object({
    title: z.string().describe("A catchy, short headline for the news item."),
    summary: z.string().describe("A one-sentence summary of the event."),
    category: z.enum(['match', 'team', 'player', 'platform']).describe("The category of the news."),
    href: z.string().describe("A relevant link for the news item, e.g., a team or player profile URL."),
});

const GeneratePlatformNewsOutputSchema = z.object({
    news: z.array(NewsItemSchema).describe("An array of 3-4 news items about recent platform activity."),
});
export type GeneratePlatformNewsOutput = z.infer<typeof GeneratePlatformNewsOutputSchema>;

const RecentActivitySchema = z.object({
    topPlayer: z.string().describe("The name of the top player."),
    winningTeam: z.object({
        name: z.string(),
        tournament: z.string(),
    }).describe("The team that recently won a tournament."),
    newHotTeam: z.string().describe("A newly formed or rapidly rising team."),
});

const getRecentActivity = ai.defineTool(
    {
        name: 'getRecentActivity',
        description: 'Gets the most recent significant activities on the platform.',
        inputSchema: z.object({}),
        outputSchema: RecentActivitySchema,
    },
    async () => {
        // This is mocked. In a real app, this would query a database/analytics service.
        return {
            topPlayer: leaderboardData[0].name,
            winningTeam: { name: 'Кибер Орлы', tournament: 'Summer Kickoff 2024' },
            newHotTeam: teams[3].name,
        };
    }
);

const prompt = ai.definePrompt({
    name: 'generatePlatformNewsPrompt',
    tools: [getRecentActivity],
    output: { schema: GeneratePlatformNewsOutputSchema },
    system: `You are an esports journalist for the ProDvor platform. 
    Your task is to generate short, engaging news items based on recent platform activity.
    Use the getRecentActivity tool to fetch the latest data.
    Write 3-4 news items. Vary the tone and style. Respond in Russian.`,
    prompt: "Generate the news digest based on the latest platform activity.",
});

export const generatePlatformNews = ai.defineFlow(
    {
        name: 'generatePlatformNewsFlow',
        inputSchema: z.void(),
        outputSchema: GeneratePlatformNewsOutputSchema,
    },
    async () => {
        const { output } = await prompt();
        if (!output) {
            throw new Error("Failed to generate platform news.");
        }
        return output;
    }
);
