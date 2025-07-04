import { z } from 'zod';

export const GenerateTournamentDetailsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the tournament idea. e.g., "Weekly valorant tournament"'),
});
export type GenerateTournamentDetailsInput = z.infer<typeof GenerateTournamentDetailsInputSchema>;

export const GenerateTournamentDetailsOutputSchema = z.object({
  name: z.string().describe('A creative and exciting name for the tournament.'),
  description: z.string().describe('A short, punchy description for the tournament announcement.'),
});
export type GenerateTournamentDetailsOutput = z.infer<typeof GenerateTournamentDetailsOutputSchema>;
