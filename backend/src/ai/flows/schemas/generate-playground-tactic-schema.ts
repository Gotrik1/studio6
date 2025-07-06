import { z } from "zod";

export const GeneratePlaygroundTacticInputSchema = z.object({
  playgroundType: z
    .string()
    .describe(
      'The type of sport the playground is for (e.g., "Футбол", "Баскетбол").',
    ),
  playgroundFeatures: z
    .array(z.string())
    .describe("A list of notable features of the playground."),
  teamPlaystyle: z
    .string()
    .describe(
      "The team's general playstyle (e.g., 'aggressive attack', 'solid defense').",
    ),
});
export type GeneratePlaygroundTacticInput = z.infer<
  typeof GeneratePlaygroundTacticInputSchema
>;

export const GeneratePlaygroundTacticOutputSchema = z.object({
  tacticName: z.string().describe("A catchy name for the tactic."),
  tacticDescription: z
    .string()
    .describe("A short, clear description of the tactic."),
  keyPoints: z
    .array(z.string())
    .describe("A list of 2-3 key points for executing the tactic."),
});
export type GeneratePlaygroundTacticOutput = z.infer<
  typeof GeneratePlaygroundTacticOutputSchema
>;
