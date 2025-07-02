'use server';

/**
 * @fileOverview An AI agent for generating user profile banners.
 *
 * - generateProfileBanner - A function that handles banner generation.
 * - GenerateProfileBannerInput - The input type for the function.
 * - GenerateProfileBannerOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { GenerateProfileBannerInputSchema, GenerateProfileBannerOutputSchema } from './schemas/generate-profile-banner-schema';
import type { GenerateProfileBannerInput, GenerateProfileBannerOutput } from './schemas/generate-profile-banner-schema';

export type { GenerateProfileBannerInput, GenerateProfileBannerOutput };


export async function generateProfileBanner(input: GenerateProfileBannerInput): Promise<GenerateProfileBannerOutput> {
  return generateProfileBannerFlow(input);
}

const generateProfileBannerFlow = ai.defineFlow(
  {
    name: 'generateProfileBannerFlow',
    inputSchema: GenerateProfileBannerInputSchema,
    outputSchema: GenerateProfileBannerOutputSchema,
  },
  async ({prompt}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A user profile banner for a sports platform. The theme is: ${prompt}. Generate a 2k, 4k, high resolution, photorealistic, sharp focus, detailed wide aspect ratio (16:9) landscape image. The image should be visually interesting but not overwhelming, suitable as a background. Avoid text. Use a digital art or cinematic style.`,
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
