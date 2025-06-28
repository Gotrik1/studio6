'use server';

/**
 * @fileOverview An AI agent for analyzing a match challenge and suggesting opponents and venues.
 *
 * - analyzeMatchChallenge - A function that handles the analysis.
 * - AnalyzeMatchChallengeInput - The input type for the function.
 * - AnalyzeMatchChallengeOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { teams as allTeams } from '@/lib/mock-data/teams';
import { venuesList } from '@/lib/mock-data/booking';

// Schemas for our data structures
const TeamSchema = z.object({
  name: z.string(),
  motto: z.string(),
  logo: z.string(),
  dataAiHint: z.string(),
  rank: z.number(),
  slug: z.string(),
});

const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  surfaceType: z.string(),
  price: z.string(),
  image: z.string(),
  imageHint: z.string(),
});

export const AnalyzeMatchChallengeInputSchema = z.string().describe('A natural language prompt describing the desired match. e.g., "Хочу сыграть в футбол в субботу вечером против равной по силе команды"');
export type AnalyzeMatchChallengeInput = z.infer<typeof AnalyzeMatchChallengeInputSchema>;

export const AnalyzeMatchChallengeOutputSchema = z.object({
  suggestedTeams: z.array(TeamSchema).describe('A list of up to 3 suggested opponent teams that fit the description.'),
  suggestedVenues: z.array(VenueSchema).describe('A list of up to 3 suggested venues that fit the description.'),
});
export type AnalyzeMatchChallengeOutput = z.infer<typeof AnalyzeMatchChallengeOutputSchema>;

// Mock data access tools for the AI
const findOpponentTeams = ai.defineTool(
  {
    name: 'findOpponentTeams',
    description: 'Finds suitable opponent teams based on a query. Use this to find teams to play against.',
    inputSchema: z.string().describe("A query describing the desired opponent, e.g., 'сильная команда по футболу', 'команда новичков из Москвы'."),
    outputSchema: z.array(TeamSchema),
  },
  async (query) => {
    // In a real app, this would be a semantic search against a database.
    // For this demo, we'll do a simple keyword filter.
    const lowercasedQuery = query.toLowerCase();
    return allTeams
      .filter(team => 
        team.name.toLowerCase().includes(lowercasedQuery) ||
        team.game.toLowerCase().includes(lowercasedQuery) ||
        (lowercasedQuery.includes('сильн') && team.rank <= 2) ||
        (lowercasedQuery.includes('новичк') && team.rank > 3)
      )
      .slice(0, 5) // Return top 5 matches to the LLM for reasoning
      .map(t => ({ name: t.name, motto: t.motto, logo: t.logo, dataAiHint: t.dataAiHint, rank: t.rank, slug: t.slug }));
  }
);

const findAvailableVenues = ai.defineTool(
  {
    name: 'findAvailableVenues',
    description: 'Finds available sports venues based on a query. Use this to find a place to play.',
    inputSchema: z.string().describe("A query describing the desired venue, e.g., 'футбольное поле в Москве', 'бесплатная баскетбольная площадка'."),
    outputSchema: z.array(VenueSchema),
  },
  async (query) => {
    // Simple keyword filtering for demo purposes.
    const lowercasedQuery = query.toLowerCase();
    return venuesList
      .filter(venue =>
        venue.name.toLowerCase().includes(lowercasedQuery) ||
        venue.address.toLowerCase().includes(lowercasedQuery) ||
        venue.surfaceType.toLowerCase().includes(lowercasedQuery) ||
        (lowercasedQuery.includes('футбол') && venue.name.toLowerCase().includes('футбол')) ||
        (lowercasedQuery.includes('баскетбол') && venue.name.toLowerCase().includes('баскетбол'))
      )
      .slice(0, 5) // Return top 5 matches to the LLM
      .map(v => ({ id: v.id, name: v.name, address: v.address, surfaceType: v.surfaceType, price: v.price, image: v.image, imageHint: v.imageHint }));
  }
);


const prompt = ai.definePrompt({
    name: 'analyzeMatchChallengePrompt',
    input: { schema: AnalyzeMatchChallengeInputSchema },
    output: { schema: AnalyzeMatchChallengeOutputSchema },
    tools: [findOpponentTeams, findAvailableVenues],
    prompt: `You are an intelligent matchmaker for the ProDvor platform.
A user wants to organize a match. Analyze their request and suggest the best opponents and venues using the provided tools.
- Use the \`findOpponentTeams\` tool to find a list of potential teams.
- Use the \`findAvailableVenues\` tool to find a list of potential venues.
- From the tool results, reason and select the top 3 most relevant teams and top 3 most relevant venues to return to the user.
- Ensure your suggestions are diverse and logical based on the user's request. For example, if they ask for a football match, only suggest football fields.
- Respond in Russian.

User Request: "{{{input}}}"
`,
});

const analyzeMatchChallengeFlow = ai.defineFlow(
  {
    name: 'analyzeMatchChallengeFlow',
    inputSchema: AnalyzeMatchChallengeInputSchema,
    outputSchema: AnalyzeMatchChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function analyzeMatchChallenge(input: AnalyzeMatchChallengeInput): Promise<AnalyzeMatchChallengeOutput> {
  return analyzeMatchChallengeFlow(input);
}
