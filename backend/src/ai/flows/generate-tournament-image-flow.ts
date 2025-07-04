'use server';

/**
 * @fileOverview An AI agent for generating images for tournaments.
 *
 * - generateTournamentImage - A function that handles image generation for a tournament.
 * - GenerateTournamentImageInput - The input type for the function.
 * - GenerateTournamentImageOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { GenerateTournamentImageInputSchema, GenerateTournamentImageOutputSchema } from './schemas/generate-tournament-image-schema';
import type { GenerateTournamentImageInput, GenerateTournamentImageOutput } from './schemas/generate-tournament-image-schema';

export type { GenerateTournamentImageInput, GenerateTournamentImageOutput };

export async function generateTournamentImage(prompt: GenerateTournamentImageInput): Promise<GenerateTournamentImageOutput> {
  return generateTournamentImageFlow_Backend(prompt);
}

const generateTournamentImageFlow_Backend = ai.defineFlow(
  {
    name: 'generateTournamentImageFlow_Backend',
    inputSchema: GenerateTournamentImageInputSchema,
    outputSchema: GenerateTournamentImageOutputSchema,
  },
  async (prompt) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A professional and exciting sports tournament banner for a tournament about: ${prompt}. Epic, cinematic, digital art style.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Image generation failed.');
    }

    return { imageDataUri: media.url };
  }
);
