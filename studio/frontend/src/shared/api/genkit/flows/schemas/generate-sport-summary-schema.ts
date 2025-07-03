import { z } from 'zod';

export const GenerateSportSummaryInputSchema = z.object({
  sportName: z.string().describe('The name of the sport.'),
});
export type GenerateSportSummaryInput = z.infer<typeof GenerateSportSummaryInputSchema>;

export const GenerateSportSummaryOutputSchema = z.object({
  summary: z.string().describe('A brief, engaging summary of the sport, including its history and basic rules.'),
  funFact: z.string().describe('An interesting and little-known fact about the sport.'),
});
export type GenerateSportSummaryOutput = z.infer<typeof GenerateSportSummaryOutputSchema>;
