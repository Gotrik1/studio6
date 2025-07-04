'use server';

/**
 * @fileOverview An AI agent for helping users find game lobbies.
 *
 * - findLfgLobbies - a function that handles the lobby search.
 * - FindLfgLobbiesInput - The input type for the function.
 * - FindLfgLobbiesOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { initialLfgLobbies } from '@/shared/lib/mock-data/lfg';
import { FindLfgLobbiesInputSchema, FindLfgLobbiesOutputSchema, LfgLobbySchema } from './schemas/find-lfg-lobbies-schema';
import type { FindLfgLobbiesInput, FindLfgLobbiesOutput } from './schemas/find-lfg-lobbies-schema';

export type { FindLfgLobbiesInput, FindLfgLobbiesOutput };

const findLobbiesTool_Backend = ai.defineTool(
  {
    name: 'findLobbies_Backend',
    description: 'Searches the platform for available game or training lobbies based on a query.',
    inputSchema: z.string().describe("A query to filter lobbies, e.g., 'футбол', 'баскетбол в парке горького', 'ищу напарника для тренировки'."),
    outputSchema: z.array(LfgLobbySchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();
    const now = new Date();
    // In a real app, this would be a more sophisticated search (e.g., semantic search).
    return initialLfgLobbies
      .filter(lobby =>
          (
            lobby.sport.toLowerCase().includes(lowercasedQuery) ||
            lobby.location.toLowerCase().includes(lowercasedQuery) ||
            lobby.comment.toLowerCase().includes(lowercasedQuery) ||
            ((lowercasedQuery.includes('тренировк') || lowercasedQuery.includes('напарник')) && lobby.type === 'training') || 
            (lowercasedQuery.includes('игр') && lobby.type === 'game')
          ) && lobby.endTime > now
      )
      .slice(0, 10); // Return up to 10 for the LLM to reason over
  }
);

const prompt = ai.definePrompt({
    name: 'findLfgLobbiesPrompt_Backend',
    input: { schema: FindLfgLobbiesInputSchema },
    output: { schema: FindLfgLobbiesOutputSchema },
    tools: [findLobbiesTool_Backend],
    system: `You are an intelligent matchmaker for the ProDvor platform. A user is looking for a game or training session to join.
1.  Analyze the user's request.
2.  Use the \`findLobbies_Backend\` tool to get a list of relevant lobbies.
3.  From the tool's results, select up to 5 lobbies that are the BEST fit for the user's request.
4.  Return the list of recommended lobbies.
5.  Respond in Russian.`,
    prompt: `User Request: "{{{input}}}"`,
});

const findLfgLobbiesFlow_Backend = ai.defineFlow(
  {
    name: 'findLfgLobbiesFlow_Backend',
    inputSchema: FindLfgLobbiesInputSchema,
    outputSchema: FindLfgLobbiesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function findLfgLobbies(input: FindLfgLobbiesInput): Promise<FindLfgLobbiesOutput> {
  return findLfgLobbiesFlow_Backend(input);
}
