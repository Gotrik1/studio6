import { z } from "zod";

export const GeneratePlaygroundSummaryInputSchema = z.object({
  name: z.string().describe("The name of the playground."),
  address: z.string().describe("The address of the playground."),
  surface: z.string().describe("The type of surface."),
  features: z.array(z.string()).describe("A list of available features."),
});
export type GeneratePlaygroundSummaryInput = z.infer<
  typeof GeneratePlaygroundSummaryInputSchema
>;

export const GeneratePlaygroundSummaryOutputSchema = z.object({
  summary: z.string().describe("A short, helpful summary for players."),
});
export type GeneratePlaygroundSummaryOutput = z.infer<
  typeof GeneratePlaygroundSummaryOutputSchema
>;
