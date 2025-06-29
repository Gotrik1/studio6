
'use server';

/**
 * @fileOverview An AI agent for generating images for social media posts.
 *
 * - generatePostImage - A function that handles image generation for a post.
 * - GeneratePostImageInput - The input type for the function.
 * - GeneratePostImageOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import {z} from 'genkit';
import { GeneratePostImageInputSchema, GeneratePostImageOutputSchema } from './schemas/generate-post-image-schema';
import type { GeneratePostImageInput, GeneratePostImageOutput } from './schemas/generate-post-image-schema';

export type { GeneratePostImageInput, GeneratePostImageOutput };

export async function generatePostImage(prompt: GeneratePostImageInput): Promise<GeneratePostImageOutput> {
  return generatePostImageFlow(prompt);
}

const generatePostImageFlow = ai.defineFlow(
  {
    name: 'generatePostImageFlow',
    inputSchema: GeneratePostImageInputSchema,
    outputSchema: GeneratePostImageOutputSchema,
  },
  async (prompt) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A vibrant and engaging social media image for an esports platform post about: ${prompt}. Cinematic, digital art style.`,
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
