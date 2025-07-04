import { z } from 'zod';

export const GenerateTournamentImageInputSchema = z.string().describe('A text description of the desired tournament banner image.');
export type GenerateTournamentImageInput = z.infer<typeof GenerateTournamentImageInputSchema>;

export const GenerateTournamentImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateTournamentImageOutput = z.infer<typeof GenerateTournamentImageOutputSchema>;
