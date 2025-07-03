'use server';
/**
 * @fileOverview An AI agent for generating a full media kit for a completed tournament.
 *
 * - generateTournamentSummary - A function that handles the generation.
 * - GenerateTournamentSummaryInput - The input type for the function.
 * - GenerateTournamentSummaryOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { GenerateTournamentSummaryInputSchema, GenerateTournamentSummaryOutputSchema } from './schemas/generate-tournament-summary-schema';
import type { GenerateTournamentSummaryInput, GenerateTournamentSummaryOutput } from './schemas/generate-tournament-summary-schema';

export type { GenerateTournamentSummaryInput, GenerateTournamentSummaryOutput };

export async function generateTournamentSummary(input: GenerateTournamentSummaryInput): Promise<GenerateTournamentSummaryOutput> {
  return generateTournamentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTournamentSummaryPrompt',
  input: { schema: GenerateTournamentSummaryInputSchema },
  output: { schema: GenerateTournamentSummaryOutputSchema },
  prompt: `You are an expert sports journalist and SMM manager for the ProDvor platform.
A tournament has just concluded. Your task is to generate a full media kit based on the results.

Tournament Name: {{{tournamentName}}}
Game: {{{tournamentGame}}}
Champion: {{{champion}}}
Final Match: {{{finalMatch.team1}}} vs {{{finalMatch.team2}}} (Score: {{{finalMatch.score}}})

Please provide the following:
1.  **Summary Article**: A 1-2 paragraph summary article about the tournament. Describe the final match and the champion's journey.
2.  **MVP**: Choose an MVP from the winning team (you can invent a plausible name) and explain your choice.
3.  **Social Media Post**: A short, exciting post for social media to announce the winner.
4.  **Image Prompts**: Exactly 4 diverse and exciting prompts for an AI image generator to create visuals for the media kit. Examples: "The winning team lifting the trophy", "MVP player in a heroic pose", etc.
`,
});

const generateTournamentSummaryFlow = ai.defineFlow(
  {
    name: 'generateTournamentSummaryFlow',
    inputSchema: GenerateTournamentSummaryInputSchema,
    outputSchema: GenerateTournamentSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
