
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
      prompt: `An abstract, non-distracting background for a user profile banner on a sports platform. Theme: ${prompt}. The image should be visually interesting but not overwhelming, suitable as a background. No text, no people. Geometric or flowing patterns are good. Aspect ratio should be approximately 3:1 (wide). Digital art style.`,
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
