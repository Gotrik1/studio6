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
  name: z.string().describe('The name of the tournament.'),
  game: z.string().describe('The game or discipline of the tournament.'),
});
export type GenerateTournamentDetailsInput = z.infer<typeof GenerateTournamentDetailsInputSchema>;

export const GenerateTournamentDetailsOutputSchema = z.object({
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
  prompt: `You are an exciting esports announcer. Generate a short, punchy, and exciting description for a tournament.
  Be creative and hype up the event. Mention the game and the tournament name.

  Tournament Name: {{{name}}}
  Game: {{{game}}}
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
