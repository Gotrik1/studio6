import { z } from "zod";

export const MultiSpeakerTtsInputSchema = z
  .string()
  .describe(
    "The script to convert to speech. Must contain 'Speaker1:' and 'Speaker2:' prefixes.",
  );
export type MultiSpeakerTtsInput = z.infer<typeof MultiSpeakerTtsInputSchema>;

export const MultiSpeakerTtsOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe("The generated audio as a data URI in WAV format."),
});
export type MultiSpeakerTtsOutput = z.infer<typeof MultiSpeakerTtsOutputSchema>;
