'use server';

/**
 * @fileOverview An AI agent for generating tournament descriptions.
 *
 * - generateTournamentDetails - A function that handles the generation.
 * - GenerateTournamentDetailsInput - The input type for the function.
 * - GenerateTournamentDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateTournamentDetailsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the tournament idea. e.g., "Weekly valorant tournament"'),
});
export type GenerateTournamentDetailsInput = z.infer<typeof GenerateTournamentDetailsInputSchema>;

export const GenerateTournamentDetailsOutputSchema = z.object({
  name: z.string().describe('A creative and exciting name for the tournament.'),
  description: z.string().describe('A short, exciting description for the tournament announcement.'),
});
export type GenerateTournamentDetailsOutput = z.infer<typeof GenerateTournamentDetailsOutputSchema>;

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
