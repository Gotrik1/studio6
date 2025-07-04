'use server';

/**
 * @fileOverview An AI agent for helping players find suitable coaches.
 *
 * - findCoaches - A function that handles the coach search process.
 * - FindCoachesInput - The input type for the function.
 * - FindCoachesOutput - The return type for the function.
 */

import { ai } from '@genkit-ai/next';
import { z } from 'zod';
import { coachesList } from '@/shared/lib/mock-data/coaches';
import {
    FindCoachesInputSchema,
    FindCoachesOutputSchema,
    CoachSchema
} from './schemas/find-coaches-schema';
import type { FindCoachesInput, FindCoachesOutput } from './schemas/find-coaches-schema';

export type { FindCoachesInput, FindCoachesOutput };

// Tool to get coaches from the database
const findCoachesTool = ai.defineTool(
  {
    name: 'findCoaches',
    description: 'Finds coaches based on a query. Use this to search for coaches specializing in a specific game or skill.',
    inputSchema: z.string().describe("A query to filter coaches, e.g., 'тренер по Valorant', 'помощь с аимом', 'тактика в футболе'."),
    outputSchema: z.array(CoachSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();
    // Simple keyword filtering for demo
    return coachesList
      .filter(coach => 
          coach.name.toLowerCase().includes(lowercasedQuery) ||
          coach.specialization.toLowerCase().includes(lowercasedQuery) ||
          coach.description.toLowerCase().includes(lowercasedQuery) ||
          coach.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      )
      .slice(0, 5); // Return up to 5 for the LLM to reason over
  }
);

const prompt = ai.definePrompt({
    name: 'findCoachesPrompt',
    input: { schema: FindCoachesInputSchema },
    output: { schema: FindCoachesOutputSchema },
    tools: [findCoachesTool],
    system: `You are an expert talent scout for the ProDvor platform, helping players find the perfect coach.
A player is looking for a coach. Your task is to:
1.  Analyze the player's request (their game, what they want to improve).
2.  Use the \`findCoaches\` tool to get a list of available coaches. Use keywords from the player's request to filter the tool's input.
3.  From the tool's results, select up to 3 coaches that are the BEST fit for the request.
4.  For each recommended coach, provide a concise reasoning explaining why they are a good match.
5.  Respond in Russian.`,
    prompt: `Player's Request: "{{{input}}}"`,
});

const findCoachesFlow = ai.defineFlow(
  {
    name: 'findCoachesFlow',
    inputSchema: FindCoachesInputSchema,
    outputSchema: FindCoachesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function findCoaches(input: FindCoachesInput): Promise<FindCoachesOutput> {
  return findCoachesFlow(input);
}
