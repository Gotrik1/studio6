import { z } from 'zod';

export const AnalyzePlaygroundDetailsInputSchema = z.object({
  name: z.string().describe('The name of the playground.'),
  type: z.string().describe('The type of sport the playground is for (e.g., "Футбол", "Баскетбол").'),
  surface: z.string().describe('The type of surface.'),
  features: z.array(z.string()).describe('A list of available features.'),
  rating: z.number().describe('The user-generated rating out of 5.'),
});
export type AnalyzePlaygroundDetailsInput = z.infer<typeof AnalyzePlaygroundDetailsInputSchema>;

export const AnalyzePlaygroundDetailsOutputSchema = z.object({
  title: z.string().describe('A catchy, informal title or nickname for the playground.'),
  vibe: z.string().describe('A one-sentence description of the overall vibe or atmosphere of the place.'),
  pros: z.array(z.string()).describe("A list of 2-3 key positive points about the playground."),
  cons: z.array(z.string()).describe("A list of 2-3 key negative points or potential drawbacks."),
  bestFor: z.string().describe('A recommendation for what type of activity this playground is best suited for.'),
});
export type AnalyzePlaygroundDetailsOutput = z.infer<typeof AnalyzePlaygroundDetailsOutputSchema>;
