'use server';

/**
 * @fileOverview An AI agent for generating images for social media posts.
 *
 * - generatePostImage - A function that handles image generation for a post.
 * - GeneratePostImageInput - The input type for the function.
 * - GeneratePostImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GeneratePostImageInputSchema = z.string().describe('A text description of the desired image, based on a social media post.');
export type GeneratePostImageInput = z.infer<typeof GeneratePostImageInputSchema>;

export const GeneratePostImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GeneratePostImageOutput = z.infer<typeof GeneratePostImageOutputSchema>;

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

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return { imageDataUri: media.url };
  }
);
