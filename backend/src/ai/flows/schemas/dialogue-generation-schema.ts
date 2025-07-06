import { z } from "zod";

export const GenerateDialogueInputSchema = z
  .string()
  .describe("The topic for the dialogue.");
export type GenerateDialogueInput = z.infer<typeof GenerateDialogueInputSchema>;

export const GenerateDialogueOutputSchema = z.object({
  dialogue: z
    .string()
    .describe(
      "A script with two speakers (Speaker1 and Speaker2) in the format 'SpeakerX: text'. Each line should be on a new line.",
    ),
});
export type GenerateDialogueOutput = z.infer<
  typeof GenerateDialogueOutputSchema
>;
