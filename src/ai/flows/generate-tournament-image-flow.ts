'use server';

/**
 * @fileOverview An AI agent for generating images for tournaments.
 *
 * - generateTournamentImage - A function that handles image generation for a tournament.
 * - GenerateTournamentImageInput - The input type for the function.
 * - GenerateTournamentImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateTournamentImageInputSchema = z.string().describe('A text description of the desired tournament banner image.');
export type GenerateTournamentImageInput = z.infer<typeof GenerateTournamentImageInputSchema>;

export const GenerateTournamentImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateTournamentImageOutput = z.infer<typeof GenerateTournamentImageOutputSchema>;

export async function generateTournamentImage(prompt: GenerateTournamentImageInput): Promise<GenerateTournamentImageOutput> {
  return generateTournamentImageFlow(prompt);
}

const generateTournamentImageFlow = ai.defineFlow(
  {
    name: 'generateTournamentImageFlow',
    inputSchema: GenerateTournamentImageInputSchema,
    outputSchema: GenerateTournamentImageOutputSchema,
  },
  async (prompt) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A professional and exciting esports tournament banner for a tournament about: ${prompt}. Epic, cinematic, digital art style.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return { imageDataUri: media.url };
  }
);
