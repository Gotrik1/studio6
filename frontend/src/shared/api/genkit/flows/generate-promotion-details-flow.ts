'use server';

/**
 * @fileOverview An AI agent for generating promotion details.
 *
 * - generatePromotionDetails - A function that handles the generation.
 * - GeneratePromotionDetailsInput - The input type for the function.
 * - GeneratePromotionDetailsOutput - The return type for the function.
 */

import {ai} from '@genkit-ai/next';
import { GeneratePromotionDetailsInputSchema, GeneratePromotionDetailsOutputSchema } from './schemas/generate-promotion-details-schema';
import type { GeneratePromotionDetailsInput, GeneratePromotionDetailsOutput } from './schemas/generate-promotion-details-schema';

export type { GeneratePromotionDetailsInput, GeneratePromotionDetailsOutput };

export async function generatePromotionDetails(input: GeneratePromotionDetailsInput): Promise<GeneratePromotionDetailsOutput> {
  return generatePromotionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionDetailsPrompt',
  input: {schema: GeneratePromotionDetailsInputSchema},
  output: {schema: GeneratePromotionDetailsOutputSchema},
  prompt: `You are a creative marketing expert for an esports platform. Based on the following idea, generate a creative name for a promotion/contest, a short description, and a prize description.
  The name, description, and prize should be in Russian.

  Promotion Idea: {{{prompt}}}
  `,
});

const generatePromotionDetailsFlow = ai.defineFlow(
  {
    name: 'generatePromotionDetailsFlow',
    inputSchema: GeneratePromotionDetailsInputSchema,
    outputSchema: GeneratePromotionDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
