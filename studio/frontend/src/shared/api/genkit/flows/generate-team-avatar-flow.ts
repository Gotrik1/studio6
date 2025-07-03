
'use server';

/**
 * @fileOverview An AI agent for generating team avatars.
 *
 * - generateTeamAvatar - A function that handles avatar generation.
 * - GenerateTeamAvatarInput - The input type for the function.
 * - GenerateTeamAvatarOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { GenerateTeamAvatarInputSchema, GenerateTeamAvatarOutputSchema } from './schemas/generate-team-avatar-schema';
import type { GenerateTeamAvatarInput, GenerateTeamAvatarOutput } from './schemas/generate-team-avatar-schema';

export type { GenerateTeamAvatarInput, GenerateTeamAvatarOutput };

export async function generateTeamAvatar(input: GenerateTeamAvatarInput): Promise<GenerateTeamAvatarOutput> {
  return generateTeamAvatarFlow(input);
}

const generateTeamAvatarFlow = ai.defineFlow(
  {
    name: 'generateTeamAvatarFlow',
    inputSchema: GenerateTeamAvatarInputSchema,
    outputSchema: GenerateTeamAvatarOutputSchema,
  },
  async ({prompt}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A sports team logo, ${prompt}. Minimalist, vector style, on a plain background.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Image generation failed.');
    }

    return { avatarDataUri: media.url };
  }
);
