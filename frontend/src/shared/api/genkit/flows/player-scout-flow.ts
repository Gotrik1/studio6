
'use server';

/**
 * @fileOverview An AI scout for helping team captains find suitable players.
 *
 * - playerScout - A function that handles the scouting process.
 * - PlayerScoutInput - The input type for the function.
 * - PlayerScoutOutput - The return type for the function.
 */

import { ai } from '@genkit-ai/next';
import { z } from 'zod';
import { userList as allUsers } from '@/shared/lib/mock-data/users';
import { PlayerScoutInputSchema, PlayerScoutOutputSchema, PlayerProfileSchema } from './schemas/player-scout-schema';
import type { PlayerScoutInput, PlayerScoutOutput } from './schemas/player-scout-schema';

export type { PlayerScoutInput, PlayerScoutOutput };

// Tool to get players from the database
const findPlayersTool = ai.defineTool(
  {
    name: 'findPlayers',
    description: 'Finds players based on a query. Use this to search for potential team members.',
    inputSchema: z.string().describe("A query to filter players, e.g., 'Футбол', 'защитник', 'опытный игрок'. Leave empty to get all active players."),
    outputSchema: z.array(PlayerProfileSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();
    return allUsers
      .filter(user => 
          user.status === 'Активен' &&
          (user.role === 'Игрок' || user.role === 'Капитан') &&
          (query === '' || user.statsSummary.toLowerCase().includes(lowercasedQuery) || user.name.toLowerCase().includes(lowercasedQuery))
      )
      .map(user => ({
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          profileUrl: user.profileUrl,
          statsSummary: user.statsSummary,
      }))
      .slice(0, 10); // Return up to 10 for the LLM to reason over
  }
);

const prompt = ai.definePrompt({
    name: 'playerScoutPrompt',
    input: { schema: PlayerScoutInputSchema },
    output: { schema: PlayerScoutOutputSchema },
    tools: [findPlayersTool],
    system: `You are an expert sports scout for the ProDvor platform.
A team captain is looking for a new player. Your task is to:
1.  Analyze the captain's request.
2.  Use the \`findPlayers\` tool to get a list of available players. You can use keywords from the captain's request to filter the tool's input if appropriate (e.g., by sport or role).
3.  From the tool's results, select up to 5 players that are the BEST fit for the request.
4.  For each recommended player, provide a concise reasoning explaining why they are a good match.
5.  Respond in Russian.`,
    prompt: `Captain's Request: "{{{input}}}"`,
});

const playerScoutFlow = ai.defineFlow(
  {
    name: 'playerScoutFlow',
    inputSchema: PlayerScoutInputSchema,
    outputSchema: PlayerScoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function playerScout(input: PlayerScoutInput): Promise<PlayerScoutOutput> {
  return playerScoutFlow(input);
}
