
'use server';

/**
 * @fileOverview An AI scout for helping sponsors find the right teams to support.
 *
 * - sponsorshipScout - A function that handles the scouting process.
 * - SponsorshipScoutInput - The input type for the function.
 * - SponsorshipScoutOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { teamsSeekingSponsorship as allTeams } from '@/lib/mock-data/sponsorship';

const TeamSchema = z.object({
    slug: z.string(),
    name: z.string(),
    logo: z.string(),
    logoHint: z.string(),
    game: z.string(),
    pitch: z.string(),
    needs: z.string(),
});

export const SponsorshipScoutInputSchema = z.string().describe('A natural language description of the sponsor\'s marketing goals and desired target audience.');
export type SponsorshipScoutInput = z.infer<typeof SponsorshipScoutInputSchema>;

export const SponsorshipScoutOutputSchema = z.object({
    recommendations: z.array(TeamSchema).describe('A list of up to 3 teams that best match the sponsor\'s goals.'),
    reasoning: z.string().describe('A brief explanation of why these specific teams were recommended.'),
});
export type SponsorshipScoutOutput = z.infer<typeof SponsorshipScoutOutputSchema>;

// Mock data access tool for the AI
const findTeamsTool = ai.defineTool(
  {
    name: 'findTeamsSeekingSponsorship',
    description: 'Finds esports teams that are currently looking for sponsorship.',
    inputSchema: z.string().describe("A query to filter teams, e.g., 'Valorant teams', 'teams from Moscow'. Leave empty to get all teams."),
    outputSchema: z.array(TeamSchema),
  },
  async (query) => {
    // In a real app, this would query a database. For now, we filter mock data.
    const lowercasedQuery = query.toLowerCase();
    return allTeams
      .filter(team =>
        team.name.toLowerCase().includes(lowercasedQuery) ||
        team.game.toLowerCase().includes(lowercasedQuery) ||
        team.pitch.toLowerCase().includes(lowercasedQuery)
      )
      .slice(0, 10); // Return up to 10 for the LLM to reason over
  }
);


const prompt = ai.definePrompt({
    name: 'sponsorshipScoutPrompt',
    input: { schema: SponsorshipScoutInputSchema },
    output: { schema: SponsorshipScoutOutputSchema },
    tools: [findTeamsTool],
    prompt: `You are an expert sponsorship scout in the esports industry.
A sponsor has described their marketing goals. Your task is to:
1.  Analyze the sponsor's request.
2.  Use the \`findTeamsSeekingSponsorship\` tool to get a list of available teams. You can use keywords from the sponsor's request to filter the tool's input if appropriate (e.g., by game).
3.  From the tool's results, select up to 3 teams that are the BEST fit for the sponsor's goals.
4.  Provide a concise reasoning for your recommendations, explaining why each team is a good match.
5.  Respond in Russian.

Sponsor's Marketing Goals: "{{{input}}}"
`,
});

const sponsorshipScoutFlow = ai.defineFlow(
  {
    name: 'sponsorshipScoutFlow',
    inputSchema: SponsorshipScoutInputSchema,
    outputSchema: SponsorshipScoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function sponsorshipScout(input: SponsorshipScoutInput): Promise<SponsorshipScoutOutput> {
  return sponsorshipScoutFlow(input);
}
