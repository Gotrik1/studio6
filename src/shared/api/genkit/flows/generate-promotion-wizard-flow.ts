'use server';

/**
 * @fileOverview An AI agent for generating a complete promotion concept from a single prompt.
 *
 * - generatePromotionWizard - A function that handles the generation.
 * - GeneratePromotionWizardInput - The input type for the function.
 * - GeneratePromotionWizardOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import {z} from 'genkit';
import {generatePromotionDetails} from './generate-promotion-details-flow';
import {generatePromotionImage} from './generate-promotion-image-flow';
import { GeneratePromotionWizardInputSchema, GeneratePromotionWizardOutputSchema } from './schemas/generate-promotion-wizard-schema';
import type { GeneratePromotionWizardInput, GeneratePromotionWizardOutput } from './schemas/generate-promotion-wizard-schema';

export type { GeneratePromotionWizardInput, GeneratePromotionWizardOutput };


export async function generatePromotionWizard(input: GeneratePromotionWizardInput): Promise<GeneratePromotionWizardOutput> {
  return generatePromotionWizardFlow(input);
}


const generatePromotionWizardFlow = ai.defineFlow(
  {
    name: 'generatePromotionWizardFlow',
    inputSchema: GeneratePromotionWizardInputSchema,
    outputSchema: GeneratePromotionWizardOutputSchema,
  },
  async ({ prompt }) => {

    const detailsPromise = generatePromotionDetails({ prompt });
    const imagePromise = generatePromotionImage(prompt);
    
    // Suggest a participation cost
    const costGenPromise = ai.generate({
        prompt: `Based on the promotion idea "${prompt}", suggest a fair participation cost in PD (ProDvor Dollars). It should be a number. If it sounds like a big event, cost can be 50-100. If it's a simple creative contest, it can be 0 or 10. Just return the number.`,
        output: {
            schema: z.string().describe('A number as a string, e.g. "50"'),
        }
    });

    const [detailsResult, imageResult, costResult] = await Promise.all([
      detailsPromise,
      imagePromise,
      costGenPromise,
    ]);

    const { output: costOutput } = costResult;
    
    if (!costOutput) {
        throw new Error("Failed to generate participation cost.");
    }

    return {
        name: detailsResult.name,
        description: detailsResult.description,
        prize: detailsResult.prize,
        imageDataUri: imageResult.imageDataUri,
        cost: costOutput,
    };
  }
);
