"use server";

/**
 * @fileOverview An AI agent for generating images for promotions.
 *
 * - generatePromotionImage - A function that handles image generation for a promotion.
 * - GeneratePromotionImageInput - The input type for the function.
 * - GeneratePromotionImageOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GeneratePromotionImageInputSchema,
  GeneratePromotionImageOutputSchema,
} from "./schemas/generate-promotion-image-schema";
import type {
  GeneratePromotionImageInput,
  GeneratePromotionImageOutput,
} from "./schemas/generate-promotion-image-schema";

export type { GeneratePromotionImageInput, GeneratePromotionImageOutput };

export async function generatePromotionImage(
  prompt: GeneratePromotionImageInput,
): Promise<GeneratePromotionImageOutput> {
  return generatePromotionImageFlow_Backend(prompt);
}

const generatePromotionImageFlow_Backend = ai.defineFlow(
  {
    name: "generatePromotionImageFlow_Backend",
    inputSchema: GeneratePromotionImageInputSchema,
    outputSchema: GeneratePromotionImageOutputSchema,
  },
  async (prompt) => {
    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-preview-image-generation",
      prompt: `A professional and exciting banner for a sponsored promotion or contest about: ${prompt}. Bright, commercial, digital art style, highlighting a prize.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (!media?.url) {
      throw new Error("Image generation failed.");
    }

    return { imageDataUri: media.url };
  },
);
