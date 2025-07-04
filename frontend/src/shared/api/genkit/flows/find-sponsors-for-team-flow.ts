'use server';

/**
 * @fileOverview An AI scout for helping teams find suitable sponsors.
 *
 * - findSponsorsForTeam - A function that handles the scouting process.
 * - FindSponsorsForTeamInput - The input type for the function.
 * - FindSponsorsForTeamOutput - The return type for the function.
 */

import { ai } from '@genkit-ai/next';
import { z } from 'zod';
import { sponsorsList } from '@/shared/lib/mock-data/sponsors';
import { 
    FindSponsorsForTeamInputSchema, 
    FindSponsorsForTeamOutputSchema, 
    SponsorSchema 
} from './schemas/find-sponsors-for-team-schema';
import type { FindSponsorsForTeamInput, FindSponsorsForTeamOutput } from './schemas/find-sponsors-for-team-schema';

export type { FindSponsorsForTeamInput, FindSponsorsForTeamOutput };

// Tool to get sponsors from the database
const findSponsorsTool = ai.defineTool(
  {
    name: 'findSponsors',
    description: 'Finds potential sponsors based on a query. Use this to search for companies that might sponsor a team.',
    inputSchema: z.string().describe("A query to filter sponsors, e.g., 'sponsors for Valorant teams', 'energy drink brands'."),
    outputSchema: z.array(SponsorSchema),
  },
  async (query) => {
    const lowercasedQuery = query.toLowerCase();
    return sponsorsList
      .filter(sponsor => 
          sponsor.name.toLowerCase().includes(lowercasedQuery) ||
          sponsor.description.toLowerCase().includes(lowercasedQuery) ||
          sponsor.interests.some(interest => interest.toLowerCase().includes(lowercasedQuery))
      )
      .slice(0, 5); // Return up to 5 for the LLM to reason over
  }
);

const prompt = ai.definePrompt({
    name: 'findSponsorsForTeamPrompt',
    input: { schema: FindSponsorsForTeamInputSchema },
    output: { schema: FindSponsorsForTeamOutputSchema },
    tools: [findSponsorsTool],
    system: `You are an expert marketing agent for the ProDvor platform, helping esports teams find sponsors.
A team is looking for sponsorship. Your task is to:
1.  Analyze the team's profile (game, description, needs).
2.  Use the \`findSponsors\` tool to get a list of potential sponsors. Use keywords from the team's profile to filter the tool's input (e.g., by game or desired sponsor type like 'energy drink').
3.  From the tool's results, select up to 3 sponsors that are the BEST fit for the team.
4.  For each recommended sponsor, provide a concise reasoning explaining why they are a good match.
5.  Respond in Russian.`,
    prompt: `Team Profile:
- Name: {{{teamName}}}
- Game: {{{teamGame}}}
- Description & Needs: "{{{teamDescription}}}"`,
});

const findSponsorsForTeamFlow = ai.defineFlow(
  {
    name: 'findSponsorsForTeamFlow',
    inputSchema: FindSponsorsForTeamInputSchema,
    outputSchema: FindSponsorsForTeamOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function findSponsorsForTeam(input: FindSponsorsForTeamInput): Promise<FindSponsorsForTeamOutput> {
  return findSponsorsForTeamFlow(input);
}
