'use server';

import { ai } from '../genkit';
import { z } from 'zod';
import { PrismaService } from '@/prisma/prisma.service';
import { textToSpeech } from './tts-flow';
import {
  GeneratePlatformNewsOutputSchema,
  NewsWithAudioSchema,
} from './schemas/generate-platform-news-schema';
import type {
  GeneratePlatformNewsOutput,
  NewsWithAudio,
} from './schemas/generate-platform-news-schema';

const prisma = new PrismaService();

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
});

const getRecentActivity = ai.defineTool(
  {
    name: 'getRecentActivity',
    description: 'Gets the most recent significant activities on the platform.',
    inputSchema: z.object({}),
    outputSchema: RecentActivitySchema,
  },
  async () => {
    const topPlayer = await prisma.user.findFirst({ orderBy: { xp: 'desc' } });
    const lastFinishedMatch = await prisma.match.findFirst({
        where: { status: 'FINISHED' },
        orderBy: { finishedAt: 'desc' },
        include: { team1: true, team2: true, tournament: true }
    });

    let winningTeam: { name: string; tournament: string } | undefined;
    if (lastFinishedMatch) {
        if ((lastFinishedMatch.team1Score || 0) > (lastFinishedMatch.team2Score || 0)) {
            winningTeam = { name: lastFinishedMatch.team1.name, tournament: lastFinishedMatch.tournament?.name || 'Unknown Tournament' };
        } else if ((lastFinishedMatch.team2Score || 0) > (lastFinishedMatch.team1Score || 0)) {
             winningTeam = { name: lastFinishedMatch.team2.name, tournament: lastFinishedMatch.tournament?.name || 'Unknown Tournament' };
        }
    }
    
    const newHotTeam = await prisma.team.findFirst({ orderBy: { id: 'desc' } });
    
    // For match of the week, find a close match
    const recentFinishedMatches = await prisma.match.findMany({
        where: { status: 'FINISHED', team1Score: { not: null }, team2Score: { not: null } },
        orderBy: { finishedAt: 'desc' },
        take: 10,
        include: { team1: true, team2: true }
    });
    
    let matchOfTheWeek: { team1: string; team2: string; score: string; summary: string; } | undefined;
    if (recentFinishedMatches.length > 0) {
        const sortedByDiff = recentFinishedMatches.sort((a,b) => 
            Math.abs((a.team1Score || 0) - (a.team2Score || 0)) - Math.abs((b.team1Score || 0) - (b.team2Score || 0))
        );
        const closeMatch = sortedByDiff[0];
        matchOfTheWeek = {
            team1: closeMatch.team1.name,
            team2: closeMatch.team2.name,
            score: `${closeMatch.team1Score}-${closeMatch.team2Score}`,
            summary: 'Невероятно напряженный матч, решившийся на последних секундах.'
        };
    }

    return {
      topPlayer: topPlayer?.name || 'Неизвестный игрок',
      winningTeam,
      newHotTeam: newHotTeam?.name,
      matchOfTheWeek,
    };
  }
);

// Define the prompt for generating the news text
const newsTextPrompt = ai.definePrompt({
  name: 'generatePlatformNewsTextPrompt_Backend',
  tools: [getRecentActivity],
  output: { schema: GeneratePlatformNewsOutputSchema },
  system: `You are an energetic and engaging sports journalist for the ProDvor platform. 
    Your task is to generate a short, exciting news digest based on recent platform activity.
    1. Use the getRecentActivity tool to fetch the latest data.
    2. Create a diverse news digest with 3-4 items. Use different data points from the tool results. If some data is missing (e.g., no recent matches), skip that news type and use another.
    3. You can write about the top player, a winning team, a new hot team, or a specific exciting match.
    4. Vary the tone and style for each news item. Make it sound cool and engaging.
    5. IMPORTANT: All generated text, including titles and summaries, MUST be in Russian.`,
  prompt: 'Generate the news digest based on the latest platform activity. The response must be in Russian.',
});

// Define the main flow
const generatePlatformNewsFlow_Backend = ai.defineFlow(
  {
    name: 'generatePlatformNewsFlow_Backend',
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
  return generatePlatformNewsFlow_Backend();
}
