'use server';

/**
 * @fileOverview An AI scout for helping sponsors find the right teams to support.
 *
 * - sponsorshipScout - A function that handles the scouting process.
 * - SponsorshipScoutInput - The input type for the function.
 * - SponsorshipScoutOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { SponsorshipScoutInputSchema, SponsorshipScoutOutputSchema, TeamSchema } from './schemas/sponsorship-scout-schema';
import type { SponsorshipScoutInput, SponsorshipScoutOutput } from './schemas/sponsorship-scout-schema';
import { PrismaService } from '@/prisma/prisma.service';

const prisma = new PrismaService();

export type { SponsorshipScoutInput, SponsorshipScoutOutput };

// Mock data access tool for the AI
const findTeamsTool = ai.defineTool(
  {
    name: 'findTeamsSeekingSponsorship_Backend',
    description: 'Finds sports teams that are currently looking for sponsorship.',
    inputSchema: z.string().describe("A query to filter teams, e.g., 'Football teams', 'teams from Moscow'. Leave empty to get all teams."),
    outputSchema: z.array(TeamSchema),
  },
  async (query) => {
    // This now queries the database
    const allTeams = await prisma.team.findMany();
    
    // In a real app, this would be a more sophisticated search (e.g., semantic search).
    const lowercasedQuery = query.toLowerCase();
    
    return allTeams
      .filter(team =>
        !query || // Return all if query is empty
        team.name.toLowerCase().includes(lowercasedQuery) ||
        team.game.toLowerCase().includes(lowercasedQuery) ||
        (team.description && team.description.toLowerCase().includes(lowercasedQuery))
      )
      .slice(0, 10) // Return up to 10 for the LLM to reason over
      .map(team => ({
          slug: team.slug,
          name: team.name,
          logo: team.logo || '',
          logoHint: team.dataAiHint || 'team logo',
          game: team.game,
          pitch: team.description || 'No description available.', // Using description as pitch
          needs: 'Funding for travel and new equipment.' // Mock needs
      }));
  }
);


const prompt = ai.definePrompt({
    name: 'sponsorshipScoutPrompt_Backend',
    input: { schema: SponsorshipScoutInputSchema },
    output: { schema: SponsorshipScoutOutputSchema },
    tools: [findTeamsTool],
    prompt: `You are an expert sponsorship scout in the sports industry.
A sponsor has described their marketing goals. Your task is to:
1.  Analyze the sponsor's request.
2.  Use the \`findTeamsSeekingSponsorship_Backend\` tool to get a list of available teams. You can use keywords from the sponsor's request to filter the tool's input if appropriate (e.g., by sport).
3.  From the tool's results, select up to 3 teams that are the BEST fit for the sponsor's goals.
4.  Provide a concise reasoning for your recommendations, explaining why each team is a good match.
5.  Respond in Russian.

Sponsor's Marketing Goals: "{{{input}}}"
`,
});

const sponsorshipScoutFlow_Backend = ai.defineFlow(
  {
    name: 'sponsorshipScoutFlow_Backend',
    inputSchema: SponsorshipScoutInputSchema,
    outputSchema: SponsorshipScoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function sponsorshipScout(input: SponsorshipScoutInput): Promise<SponsorshipScoutOutput> {
  return sponsorshipScoutFlow_Backend(input);
}
