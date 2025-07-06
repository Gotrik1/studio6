import { z } from "zod";

export const GeneratePlaygroundDrillInputSchema = z.object({
  userWeakness: z
    .string()
    .describe(
      'A specific weakness of the player, e.g., "low 3-point percentage" or "poor ball control".',
    ),
  playgroundType: z
    .string()
    .describe(
      'The type of sport the playground is for (e.g., "Футбол", "Баскетбол").',
    ),
});
export type GeneratePlaygroundDrillInput = z.infer<
  typeof GeneratePlaygroundDrillInputSchema
>;

export const GeneratePlaygroundDrillOutputSchema = z.object({
  title: z.string().describe("A catchy, motivating title for the skill drill."),
  description: z
    .string()
    .describe("A clear, one-sentence description of the task to perform."),
  reward: z.number().describe("The reward in PD for completing the drill."),
});
export type GeneratePlaygroundDrillOutput = z.infer<
  typeof GeneratePlaygroundDrillOutputSchema
>;
