
'use server';

/**
 * @fileOverview An AI-powered search agent for the ProDvor platform.
 *
 * - smartSearch - A function that performs a semantic search across users, teams, and tournaments.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { userList } from '@/shared/lib/mock-data/users';
import { teams as allTeams } from '@/shared/lib/mock-data/teams';
import { allTournaments } from '@/shared/lib/mock-data/tournaments';
import { SmartSearchInputSchema, SmartSearchOutputSchema, UserSchema, TeamSchema, TournamentSchema } from './schemas/smart-search-schema';
import type { SmartSearchInput, SmartSearchOutput } from './schemas/smart-search-schema';

export type { SmartSearchInput, SmartSearchOutput };

const searchPlatformData = ai.defineTool(
  {
    name: 'searchPlatformData',
    description: 'Searches for users, teams, and tournaments based on a textual query. Use this to find any information on the platform.',
    inputSchema: z.string().describe('The user\'s search query.'),
    outputSchema: SmartSearchOutputSchema,
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();

    const users = userList.filter(u =>
      u.name.toLowerCase().includes(lowercasedQuery) ||
      u.email.toLowerCase().includes(lowercasedQuery) ||
      u.role.toLowerCase().includes(lowercasedQuery)
    ).map(u => ({id: u.id, name: u.name, role: u.role, avatar: u.avatar, profileUrl: u.profileUrl}));

    const teams = allTeams.filter(t =>
      t.name.toLowerCase().includes(lowercasedQuery) ||
      t.motto.toLowerCase().includes(lowercasedQuery) ||
      t.game.toLowerCase().includes(lowercasedQuery)
    ).map(t => ({name: t.name, motto: t.motto, logo: t.logo, dataAiHint: t.dataAiHint, rank: t.rank, members: t.members, slug: t.slug, game: t.game}));

    const tournaments = allTournaments.filter(t =>
      t.name.toLowerCase().includes(lowercasedQuery) ||
      t.game.toLowerCase().includes(lowercasedQuery)
    ).map(t => ({name: t.name, game: t.game, status: t.status, image: t.image, dataAiHint: t.dataAiHint, slug: t.slug}));

    return { users, teams, tournaments };
  }
);


export async function smartSearch(query: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(query);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: { schema: SmartSearchInputSchema },
  output: { schema: SmartSearchOutputSchema },
  tools: [searchPlatformData],
  prompt: `You are a powerful search engine for the "ProDvor" esports platform.
Your task is to analyze the user's query and return the most relevant users, teams, and tournaments.
To do this, you MUST use the \`searchPlatformData\` tool.
Analyze the tool's output and present it clearly in the required format.
If the user's query is specific (e.g., "find valorant teams"), use the tool to get a broad set of results and then use your reasoning to filter them down to match the specific request.

User Query: "{{{input}}}"
`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
