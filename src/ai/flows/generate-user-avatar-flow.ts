'use server';

/**
 * @fileOverview An AI agent for generating user avatars.
 *
 * - generateUserAvatar - A function that handles avatar generation.
 * - GenerateUserAvatarInput - The input type for the function.
 * - GenerateUserAvatarOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateUserAvatarInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired avatar image.'),
});
export type GenerateUserAvatarInput = z.infer<typeof GenerateUserAvatarInputSchema>;

export const GenerateUserAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateUserAvatarOutput = z.infer<typeof GenerateUserAvatarOutputSchema>;

export async function generateUserAvatar(input: GenerateUserAvatarInput): Promise<GenerateUserAvatarOutput> {
  return generateUserAvatarFlow(input);
}

const generateUserAvatarFlow = ai.defineFlow(
  {
    name: 'generateUserAvatarFlow',
    inputSchema: GenerateUserAvatarInputSchema,
    outputSchema: GenerateUserAvatarOutputSchema,
  },
  async ({prompt}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A square user profile picture for an esports platform. The user wants an avatar of: ${prompt}. Digital art, cool, vibrant, character portrait style.`,
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
