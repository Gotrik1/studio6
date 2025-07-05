'use server';
/**
 * @fileOverview An AI agent for finding sports venues based on natural language.
 * - findVenues - a function that handles the venue search.
 * - FindVenuesInput - The input type for the function.
 * - FindVenuesOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { FindVenuesInputSchema, FindVenuesOutputSchema, PlaygroundSchema } from './schemas/find-venues-schema';
import type { FindVenuesInput, FindVenuesOutput } from './schemas/find-venues-schema';
import { PrismaService } from '@/prisma/prisma.service';

const prisma = new PrismaService();

export type { FindVenuesInput, FindVenuesOutput };

// Mock data access tool for the AI
const findAvailableVenuesTool_Backend = ai.defineTool(
  {
    name: 'findAvailableVenues_Backend',
    description: 'Finds available sports venues based on a query. Use this to find a place to play.',
    inputSchema: z.object({
        query: z.string().describe("A query describing the desired venue, e.g., 'футбольное поле в Москве', 'бесплатная баскетбольная площадка', 'корт с освещением'."),
    }),
    outputSchema: z.array(PlaygroundSchema),
  },
  async (input) => {
    // Simple keyword filtering for demo purposes.
    const lowercasedQuery = input.query.toLowerCase();
    
    const playgrounds = await prisma.playground.findMany({
        where: {
            status: 'APPROVED',
            OR: [
                { name: { contains: lowercasedQuery, mode: 'insensitive' } },
                { address: { contains: lowercasedQuery, mode: 'insensitive' } },
                { surface: { contains: lowercasedQuery, mode: 'insensitive' } },
                { features: { has: lowercasedQuery } },
                { type: { contains: lowercasedQuery, mode: 'insensitive' } }
            ]
        },
        take: 10
    });

    return playgrounds.map(p => ({
        ...p,
        coverImage: p.coverImage || 'https://placehold.co/600x400.png',
        coverImageHint: p.coverImageHint || 'sports playground',
    }));
  }
);


const prompt = ai.definePrompt({
    name: 'findVenuesPrompt_Backend',
    input: { schema: FindVenuesInputSchema },
    output: { schema: FindVenuesOutputSchema },
    tools: [findAvailableVenuesTool_Backend],
    prompt: `You are an intelligent assistant for the ProDvor platform helping users find sports venues.
- Analyze the user's request and use the \`findAvailableVenues_Backend\` tool to get a list of potential venues.
- From the tool results, select up to 5 of the most relevant venues to return to the user.
- Create a friendly, natural language summary of your findings. Explain briefly why these places are a good match for the user's request. For example, if the user asks for a quiet place, mention which of the results are less crowded.
- Respond in Russian.

User Request: "{{{query}}}"
`,
});

const findVenuesFlow_Backend = ai.defineFlow(
  {
    name: 'findVenuesFlow_Backend',
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
  return findVenuesFlow_Backend(input);
}
