'use server';

/**
 * @fileOverview An AI-powered search agent for the ProDvor platform.
 *
 * - smartSearch - A function that performs a semantic search across users, teams, and tournaments.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { PrismaService } from '@/prisma/prisma.service';
import { SmartSearchInputSchema, SmartSearchOutputSchema, UserSchema, TeamSchema, TournamentSchema } from './schemas/smart-search-schema';
import type { SmartSearchInput, SmartSearchOutput } from './schemas/smart-search-schema';

const prisma = new PrismaService();

export type { SmartSearchInput, SmartSearchOutput };

const searchPlatformData_Backend = ai.defineTool(
  {
    name: 'searchPlatformData_Backend',
    description: 'Searches for users, teams, and tournaments based on a textual query. Use this to find any information on the platform.',
    inputSchema: z.string().describe('The user\'s search query.'),
    outputSchema: SmartSearchOutputSchema,
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    const users = (await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: lowercasedQuery, mode: 'insensitive' } },
                { email: { contains: lowercasedQuery, mode: 'insensitive' } },
                { role: { contains: lowercasedQuery, mode: 'insensitive' } },
            ]
        },
        take: 10,
    })).map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
        avatar: u.avatar || 'https://placehold.co/100x100.png',
        profileUrl: `/profiles/player/${u.id}`, // Simplified
    }));

    const teams = (await prisma.team.findMany({
        where: {
             OR: [
                { name: { contains: lowercasedQuery, mode: 'insensitive' } },
                { game: { contains: lowercasedQuery, mode: 'insensitive' } },
                { description: { contains: lowercasedQuery, mode: 'insensitive' } },
            ]
        },
        include: { _count: { select: { members: true } } },
        take: 10,
    })).map(t => ({
        name: t.name,
        motto: t.motto || '',
        logo: t.logo || 'https://placehold.co/100x100.png',
        dataAiHint: t.dataAiHint || 'team logo',
        rank: t.rank,
        members: t._count.members,
        slug: t.slug,
        game: t.game,
    }));

    const tournaments = (await prisma.tournament.findMany({
       where: {
             OR: [
                { name: { contains: lowercasedQuery, mode: 'insensitive' } },
                { game: { contains: lowercasedQuery, mode: 'insensitive' } },
                { description: { contains: lowercasedQuery, mode: 'insensitive' } },
            ]
        },
        take: 10,
    })).map(t => ({
        name: t.name,
        game: t.game,
        status: t.status,
        image: t.bannerImage || 'https://placehold.co/2560x720.png',
        dataAiHint: t.bannerImageHint || 'esports tournament',
        slug: t.slug,
    }));

    return { users, teams, tournaments };
  }
);


const smartSearchPrompt_Backend = ai.definePrompt({
  name: 'smartSearchPrompt_Backend',
  input: { schema: SmartSearchInputSchema },
  output: { schema: SmartSearchOutputSchema },
  tools: [searchPlatformData_Backend],
  prompt: `You are a powerful search engine for the "ProDvor" sports platform.
Your task is to analyze the user's query and return the most relevant users, teams, and tournaments.
To do this, you MUST use the \`searchPlatformData_Backend\` tool.
Analyze the tool's output and present it clearly in the required format.
If the user's query is specific (e.g., "find football teams"), use the tool to get a broad set of results and then use your reasoning to filter them down to match the specific request.

User Query: "{{{input}}}"
`,
});

const smartSearchFlow_Backend = ai.defineFlow(
  {
    name: 'smartSearchFlow_Backend',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function smartSearch(query: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow_Backend(query);
}
