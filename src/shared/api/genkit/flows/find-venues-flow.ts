'use server';

/**
 * @fileOverview An AI agent for finding sports venues based on natural language.
 * - findVenues - a function that handles the venue search.
 * - FindVenuesInput - The input type for the function.
 * - FindVenuesOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import { FindVenuesInputSchema, FindVenuesOutputSchema, PlaygroundSchema } from './schemas/find-venues-schema';
import type { FindVenuesInput, FindVenuesOutput } from './schemas/find-venues-schema';

export type { FindVenuesInput, FindVenuesOutput };

// Mock data access tool for the AI
const findAvailableVenuesTool = ai.defineTool(
  {
    name: 'findAvailableVenues',
    description: 'Finds available sports venues based on a query. Use this to find a place to play.',
    inputSchema: z.object({
        query: z.string().describe("A query describing the desired venue, e.g., 'футбольное поле в Москве', 'бесплатная баскетбольная площадка', 'корт с освещением'."),
    }),
    outputSchema: z.array(PlaygroundSchema),
  },
  async (input) => {
    // Simple keyword filtering for demo purposes.
    const lowercasedQuery = input.query.toLowerCase();
    return playgroundsList
      .filter(venue =>
        venue.name.toLowerCase().includes(lowercasedQuery) ||
        venue.address.toLowerCase().includes(lowercasedQuery) ||
        venue.surface.toLowerCase().includes(lowercasedQuery) ||
        venue.features.some(f => f.toLowerCase().includes(lowercasedQuery)) ||
        (lowercasedQuery.includes('футбол') && venue.type.toLowerCase().includes('футбол')) ||
        (lowercasedQuery.includes('баскетбол') && venue.type.toLowerCase().includes('баскетбол'))
      )
      .slice(0, 10); // Return top 10 matches to the LLM for reasoning
  }
);


const prompt = ai.definePrompt({
    name: 'findVenuesPrompt',
    input: { schema: FindVenuesInputSchema },
    output: { schema: FindVenuesOutputSchema },
    tools: [findAvailableVenuesTool],
    prompt: `You are an intelligent assistant for the ProDvor platform helping users find sports venues.
- Analyze the user's request and use the \`findAvailableVenues\` tool to get a list of potential venues.
- From the tool results, select up to 5 of the most relevant venues to return to the user.
- Create a friendly, natural language summary of your findings. Explain briefly why these places are a good match for the user's request. For example, if the user asks for a quiet place, mention which of the results are less crowded.
- Respond in Russian.

User Request: "{{{query}}}"
`,
});

const findVenuesFlow = ai.defineFlow(
  {
    name: 'findVenuesFlow',
    inputSchema: FindVenuesInputSchema,
    outputSchema: FindVenuesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        return { summary: '', suggestedVenues: [] };
    }
    return output;
  }
);

export async function findVenues(input: FindVenuesInput): Promise<FindVenuesOutput> {
  return findVenuesFlow(input);
}
