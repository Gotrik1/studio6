'use server';

/**
 * @fileOverview An AI agent for finding sports venues based on natural language.
 * - findVenues - A function that handles the venue search.
 * - FindVenuesInput - The input type for the function.
 * - FindVenuesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { venuesList } from '@/lib/mock-data/booking';

// Schema for our data structures
const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  surfaceType: z.string(),
  price: z.string(),
  image: z.string(),
  imageHint: z.string(),
  features: z.array(z.string()),
  rating: z.number(),
});

export const FindVenuesInputSchema = z.string().describe('A natural language prompt describing the desired venue. e.g., "Хочу найти футбольное поле с хорошим освещением на вечер"');
export type FindVenuesInput = z.infer<typeof FindVenuesInputSchema>;

export const FindVenuesOutputSchema = z.object({
  suggestedVenues: z.array(VenueSchema).describe('A list of up to 5 suggested venues that fit the description.'),
});
export type FindVenuesOutput = z.infer<typeof FindVenuesOutputSchema>;

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
