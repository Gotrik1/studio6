import { z } from 'zod';

export const TextToSpeechInputSchema = z.string().describe("The text to convert to speech.");
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
    audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
