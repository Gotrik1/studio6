'use server';

/**
 * @fileOverview An AI agent for finding sports venues based on natural language.
 * - findVenues - A function that handles the venue search.
 * - FindVenuesInput - The input type for the function.
 * - FindVenuesOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { venuesList } from '@/shared/lib/mock-data/booking';
import { FindVenuesInputSchema, FindVenuesOutputSchema, VenueSchema } from './schemas/find-venues-schema';
import type { FindVenuesInput, FindVenuesOutput } from './schemas/find-venues-schema';

export type { FindVenuesInput, FindVenuesOutput };

// Mock data access tool for the AI
const findAvailableVenuesTool = ai.defineTool(
  {
    name: 'findAvailableVenues',
    description: 'Finds available sports venues based on a query. Use this to find a place to play.',
    inputSchema: z.string().describe("A query describing the desired venue, e.g., 'футбольное поле в Москве', 'бесплатная баскетбольная площадка', 'корт с освещением'."),
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
        venue.features.some(f => f.toLowerCase().includes(lowercasedQuery)) ||
        (lowercasedQuery.includes('футбол') && venue.name.toLowerCase().includes('футбол')) ||
        (lowercasedQuery.includes('баскетбол') && venue.name.toLowerCase().includes('баскетбол'))
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
- Respond in Russian.

User Request: "{{{input}}}"
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
    return output!;
  }
);

export async function findVenues(input: FindVenuesInput): Promise<FindVenuesOutput> {
  return findVenuesFlow(input);
}
