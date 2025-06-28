'use server';

/**
 * @fileOverview An AI-powered search agent for the ProDvor platform.
 *
 * - smartSearch - A function that performs a semantic search across users, teams, and tournaments.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { userList } from '@/lib/mock-data/users';
import { teams as allTeams } from '@/lib/mock-data/teams';
import { allTournaments } from '@/lib/mock-data/tournaments';

// Define schemas for the data we're searching over
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  profileUrl: z.string(),
});

const TeamSchema = z.object({
  name: z.string(),
  motto: z.string(),
  logo: z.string(),
  dataAiHint: z.string(),
  rank: z.number(),
  members: z.number(),
  slug: z.string(),
});

const TournamentSchema = z.object({
  name: z.string(),
  game: z.string(),
  status: z.string(),
  image: z.string(),
  dataAiHint: z.string(),
  slug: z.string(),
});


export const SmartSearchInputSchema = z.string().describe('The user\'s natural language search query.');
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

export const SmartSearchOutputSchema = z.object({
  users: z.array(UserSchema).describe('A list of users relevant to the query.'),
  teams: z.array(TeamSchema).describe('A list of teams relevant to the query.'),
  tournaments: z.array(TournamentSchema).describe('A list of tournaments relevant to the query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

// For the prototype, we'll stringify the mock data and include it in the prompt.
// In a real application, this would be a tool that queries a database.
const stringifiedData = `
Users:
${JSON.stringify(userList.map(u => ({id: u.id, name: u.name, role: u.role, avatar: u.avatar, profileUrl: u.profileUrl})), null, 2)}

Teams:
${JSON.stringify(allTeams.map(t => ({name: t.name, motto: t.motto, logo: t.logo, dataAiHint: t.dataAiHint, rank: t.rank, members: t.members, slug: t.slug})), null, 2)}

Tournaments:
${JSON.stringify(allTournaments.map(t => ({name: t.name, game: t.game, status: t.status, image: t.image, dataAiHint: t.dataAiHint, slug: t.slug})), null, 2)}
`;


export async function smartSearch(query: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(query);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: { schema: SmartSearchInputSchema },
  output: { schema: SmartSearchOutputSchema },
  prompt: `You are a powerful search engine for the "ProDvor" esports platform.
Your task is to analyze the user's query and return the most relevant users, teams, and tournaments from the provided data.
The query can be a simple keyword or a natural language question (e.g., "find valorant teams from moscow" or "tournaments with prize over $5000").
Carefully filter the data based on the user's intent. If no results are found in a category, return an empty array for that category.

User Query: "{{{input}}}"

Available Data:
${stringifiedData}
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
