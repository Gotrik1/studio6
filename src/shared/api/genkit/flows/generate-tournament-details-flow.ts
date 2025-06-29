'use server';

/**
 * @fileOverview An AI agent for generating tournament descriptions.
 *
 * - generateTournamentDetails - A function that handles the generation.
 * - GenerateTournamentDetailsInput - The input type for the function.
 * - GenerateTournamentDetailsOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { GenerateTournamentDetailsInputSchema, GenerateTournamentDetailsOutputSchema } from './schemas/generate-tournament-details-schema';
import type { GenerateTournamentDetailsInput, GenerateTournamentDetailsOutput } from './schemas/generate-tournament-details-schema';

export type { GenerateTournamentDetailsInput, GenerateTournamentDetailsOutput };

export async function generateTournamentDetails(input: GenerateTournamentDetailsInput): Promise<GenerateTournamentDetailsOutput> {
  return generateTournamentDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTournamentDetailsPrompt',
  input: {schema: GenerateTournamentDetailsInputSchema},
  output: {schema: GenerateTournamentDetailsOutputSchema},
  prompt: `You are an exciting esports announcer. Based on the following idea, generate a creative tournament name and a short, punchy description to announce it.
  The name and description should be in Russian.

  Tournament Idea: {{{prompt}}}
  `,
});

const generateTournamentDetailsFlow = ai.defineFlow(
  {
    name: 'generateTournamentDetailsFlow',
    inputSchema: GenerateTournamentDetailsInputSchema,
    outputSchema: GenerateTournamentDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
