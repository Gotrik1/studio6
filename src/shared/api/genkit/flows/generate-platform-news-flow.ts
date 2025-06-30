'use server';

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { teams } from '@/shared/lib/mock-data/teams';
import { leaderboardData } from '@/shared/lib/mock-data/leaderboards';
import { textToSpeech } from './tts-flow';
import {
  GeneratePlatformNewsOutputSchema,
  NewsWithAudioSchema,
} from './schemas/generate-platform-news-schema';
import type {
  GeneratePlatformNewsOutput,
  NewsWithAudio,
} from './schemas/generate-platform-news-schema';

export type { GeneratePlatformNewsOutput, NewsWithAudio };

// Define the tool to get recent activity
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

// Define the prompt for generating the news text
const newsTextPrompt = ai.definePrompt({
    name: 'generatePlatformNewsTextPrompt',
    tools: [getRecentActivity],
    output: { schema: GeneratePlatformNewsOutputSchema },
    system: `You are an esports journalist for the ProDvor platform. 
    Your task is to generate short, engaging news items based on recent platform activity.
    Use the getRecentActivity tool to fetch the latest data.
    Write 3-4 news items. Vary the tone and style. Respond in Russian.`,
    prompt: "Generate the news digest based on the latest platform activity.",
});

// Define the main flow
const generatePlatformNewsFlow = ai.defineFlow(
    {
        name: 'generatePlatformNewsFlow',
        inputSchema: z.void(),
        outputSchema: NewsWithAudioSchema,
    },
    async () => {
        const { output: newsData } = await newsTextPrompt();
        if (!newsData || !newsData.news || newsData.news.length === 0) {
            throw new Error("Failed to generate platform news text.");
        }

        // Create a single string for TTS
        const newsString = newsData.news.map(item => `${item.title}. ${item.summary}`).join('\n\n');
        
        // Generate audio
        const { audioDataUri } = await textToSpeech(newsString);

        return {
            news: newsData.news,
            audioDataUri,
        };
    }
);

export async function generatePlatformNewsWithAudio(): Promise<NewsWithAudio> {
    return generatePlatformNewsFlow();
}
