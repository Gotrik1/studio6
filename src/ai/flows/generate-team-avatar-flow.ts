'use server';

/**
 * @fileOverview An AI agent for generating team avatars.
 *
 * - generateTeamAvatar - A function that handles avatar generation.
 * - GenerateTeamAvatarInput - The input type for the function.
 * - GenerateTeamAvatarOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateTeamAvatarInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired avatar image.'),
});
export type GenerateTeamAvatarInput = z.infer<typeof GenerateTeamAvatarInputSchema>;

export const GenerateTeamAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateTeamAvatarOutput = z.infer<typeof GenerateTeamAvatarOutputSchema>;

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
      prompt: `An esports team logo, ${prompt}. Minimalist, vector style, on a plain background.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return { avatarDataUri: media.url };
  }
);
