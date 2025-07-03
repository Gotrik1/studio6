import { z } from 'zod';

export const GenerateTournamentWizardInputSchema = z.object({
  prompt: z.string().describe('A simple text prompt describing the tournament idea, e.g., "Weekly Valorant tournament for amateurs".'),
});
export type GenerateTournamentWizardInput = z.infer<typeof GenerateTournamentWizardInputSchema>;

export const GenerateTournamentWizardOutputSchema = z.object({
  name: z.string().describe('The generated name of the tournament.'),
  description: z.string().describe('A short, exciting description for the tournament announcement.'),
  imageDataUri: z.string().describe("The generated tournament banner image as a data URI."),
  prizePool: z.string().describe("A suggested prize pool structure."),
  schedule: z.string().describe("A suggested schedule for the tournament."),
});
export type GenerateTournamentWizardOutput = z.infer<typeof GenerateTournamentWizardOutputSchema>;
