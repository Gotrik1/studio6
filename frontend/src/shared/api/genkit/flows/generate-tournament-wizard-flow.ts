
'use server';

/**
 * @fileOverview An AI agent for generating a complete tournament concept from a single prompt.
 *
 * - generateTournamentWizard - A function that handles the generation.
 * - GenerateTournamentWizardInput - The input type for the function.
 * - GenerateTournamentWizardOutput - The return type for the function.
 */

import {ai} from '@genkit-ai/next';
import {z} from 'genkit';
import {generateTournamentDetails} from './generate-tournament-details-flow';
import {generateTournamentImage} from './generate-tournament-image-flow';
import { GenerateTournamentWizardInputSchema, GenerateTournamentWizardOutputSchema } from './schemas/generate-tournament-wizard-schema';
import type { GenerateTournamentWizardInput, GenerateTournamentWizardOutput } from './schemas/generate-tournament-wizard-schema';

export type { GenerateTournamentWizardInput, GenerateTournamentWizardOutput };


export async function generateTournamentWizard(input: GenerateTournamentWizardInput): Promise<GenerateTournamentWizardOutput> {
  return generateTournamentWizardFlow(input);
}


const generateTournamentWizardFlow = ai.defineFlow(
  {
    name: 'generateTournamentWizardFlow',
    inputSchema: GenerateTournamentWizardInputSchema,
    outputSchema: GenerateTournamentWizardOutputSchema,
  },
  async ({ prompt }) => {

    const detailsPromise = generateTournamentDetails({ prompt });

    const imagePromise = generateTournamentImage(prompt);
    
    const textGenPromise = ai.generate({
        prompt: `Based on the tournament idea "${prompt}", generate a simple prize pool and a weekly schedule.
        Prize Pool: List 3 prize tiers (e.g., 1st, 2nd, 3rd place) with appropriate rewards (can be money or in-game items).
        Schedule: List key dates (e.g., Registration Closes, Group Stage, Finals).
        Keep it concise and formatted with clear headings. Use Russian language.`,
        output: {
            schema: z.object({
                prizePool: z.string(),
                schedule: z.string(),
            }),
        }
    });

    const [detailsResult, imageResult, textGenResult] = await Promise.all([
      detailsPromise,
      imagePromise,
      textGenPromise,
    ]);

    const { output: textOutput } = textGenResult;
    
    if (!textOutput) {
        throw new Error("Failed to generate prize pool and schedule.");
    }

    return {
        name: detailsResult.name,
        description: detailsResult.description,
        imageDataUri: imageResult.imageDataUri,
        prizePool: textOutput.prizePool,
        schedule: textOutput.schedule,
    };
  }
);
