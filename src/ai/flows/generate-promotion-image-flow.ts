'use server';

/**
 * @fileOverview An AI agent for generating images for promotions.
 *
 * - generatePromotionImage - A function that handles image generation for a promotion.
 * - GeneratePromotionImageInput - The input type for the function.
 * - GeneratePromotionImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GeneratePromotionImageInputSchema = z.string().describe('A text description of the desired promotion banner image.');
export type GeneratePromotionImageInput = z.infer<typeof GeneratePromotionImageInputSchema>;

export const GeneratePromotionImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GeneratePromotionImageOutput = z.infer<typeof GeneratePromotionImageOutputSchema>;

export async function generatePromotionImage(prompt: GeneratePromotionImageInput): Promise<GeneratePromotionImageOutput> {
  return generatePromotionImageFlow(prompt);
}

const generatePromotionImageFlow = ai.defineFlow(
  {
    name: 'generatePromotionImageFlow',
    inputSchema: GeneratePromotionImageInputSchema,
    outputSchema: GeneratePromotionImageOutputSchema,
  },
  async (prompt) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A professional and exciting banner for a sponsored promotion or contest about: ${prompt}. Bright, commercial, digital art style, highlighting a prize.`,
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
