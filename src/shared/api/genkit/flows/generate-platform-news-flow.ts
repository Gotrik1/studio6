'use server';

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { teams } from '@/shared/lib/mock-data/teams';
import { leaderboardData } from '@/shared/lib/mock-data/leaderboards';
import { matchesList } from '@/shared/lib/mock-data/matches';
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
  topPlayer: z.string().describe('The name of the top player on the leaderboards.'),
  winningTeam: z
    .object({
      name: z.string(),
      tournament: z.string(),
    })
    .describe('A team that recently won a tournament.').optional(),
  newHotTeam: z.string().describe('A newly formed or rapidly rising team.').optional(),
  matchOfTheWeek: z
    .object({
      team1: z.string(),
      team2: z.string(),
      score: z.string(),
      summary: z.string().describe('A one-sentence summary of why the match was exciting.'),
    })
    .describe('Details of a particularly exciting recent match.').optional(),
  promotedPlayer: z
    .object({
      name: z.string(),
      newRank: z.string(),
    })
    .describe('A player who recently achieved a new significant rank.').optional(),
});

const getRecentActivity = ai.defineTool(
  {
    name: 'getRecentActivity',
    description: 'Gets the most recent significant activities on the platform.',
    inputSchema: z.object({}),
    outputSchema: RecentActivitySchema,
  },
  async () => {
    // This is mocked, but now it's dynamic based on other mock files.
    const topPlayer = leaderboardData[0]?.name || 'Неизвестный игрок';

    const lastFinishedMatch = [...matchesList]
        .filter(m => m.status === 'Завершен' && m.score.split('-').length === 2)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    let winningTeam: { name: string; tournament: string } | undefined;
    if (lastFinishedMatch) {
        const scores = lastFinishedMatch.score.split('-').map(s => parseInt(s.trim()));
        if (!isNaN(scores[0]) && !isNaN(scores[1])) {
             if (scores[0] > scores[1]) {
                winningTeam = { name: lastFinishedMatch.team1.name, tournament: lastFinishedMatch.tournament };
            } else if (scores[1] > scores[0]) {
                winningTeam = { name: lastFinishedMatch.team2.name, tournament: lastFinishedMatch.tournament };
            }
        }
    }
    
    // Find a "hot" new team (last one in the list for demo)
    const newHotTeam = teams[teams.length - 1]?.name;

    // Find a close match for "match of the week"
    const closeMatch = [...matchesList]
      .filter(m => m.status === 'Завершен' && m.score.split('-').length === 2)
      .sort((a,b) => {
        const scoreA = a.score.split('-').map(s => parseInt(s.trim()));
        const scoreB = b.score.split('-').map(s => parseInt(s.trim()));
        if (isNaN(scoreA[0]) || isNaN(scoreA[1]) || isNaN(scoreB[0]) || isNaN(scoreB[1])) return 0;
        const diffA = Math.abs(scoreA[0] - scoreA[1]);
        const diffB = Math.abs(scoreB[0] - scoreB[1]);
        return diffA - diffB;
      })[0];
    
    let matchOfTheWeek: { team1: string; team2: string; score: string; summary: string; } | undefined;
    if (closeMatch) {
        matchOfTheWeek = {
            team1: closeMatch.team1.name,
            team2: closeMatch.team2.name,
            score: closeMatch.score,
            summary: 'Невероятно напряженный матч, решившийся на последних секундах.'
        };
    }

    // Mock a promoted player
    const promotedPlayer = {
        name: 'ТеневойУдар',
        newRank: 'Гроза района',
    };
    
    return {
      topPlayer,
      winningTeam,
      newHotTeam,
      matchOfTheWeek,
      promotedPlayer,
    };
  }
);

// Define the prompt for generating the news text
const newsTextPrompt = ai.definePrompt({
  name: 'generatePlatformNewsTextPrompt',
  tools: [getRecentActivity],
  output: { schema: GeneratePlatformNewsOutputSchema },
  system: `You are an energetic and engaging sports journalist for the ProDvor platform. 
    Your task is to generate a short, exciting news digest based on recent platform activity.
    1. Use the getRecentActivity tool to fetch the latest data.
    2. Create a diverse news digest with 3-4 items. Use different data points from the tool results. If some data is missing (e.g., no recent matches), skip that news type and use another.
    3. You can write about the top player, a winning team, a new hot team, a specific exciting match, or congratulate a player on a promotion.
    4. Vary the tone and style for each news item. Make it sound cool and engaging.
    5. IMPORTANT: All generated text, including titles and summaries, MUST be in Russian.`,
  prompt: 'Generate the news digest based on the latest platform activity. The response must be in Russian.',
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
      throw new Error('Failed to generate platform news text.');
    }

    // Create a single string for TTS
    const newsString = newsData.news
      .map(item => `${item.title}. ${item.summary}`)
      .join('\n\n');

    let audioDataUri: string | undefined;
    try {
      // Generate audio
      const result = await textToSpeech(newsString);
      audioDataUri = result.audioDataUri;
    } catch (e) {
      console.error(
        'TTS generation failed due to rate limits or other issues, continuing without audio.',
        e
      );
      audioDataUri = undefined;
    }

    return {
      news: newsData.news,
      audioDataUri,
    };
  }
);

export async function generatePlatformNewsWithAudio(): Promise<NewsWithAudio> {
  return generatePlatformNewsFlow();
}
