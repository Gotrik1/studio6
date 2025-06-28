'use server';

/**
 * @fileOverview An AI agent for generating a complete tournament concept from a single prompt.
 *
 * - generateTournamentWizard - A function that handles the generation.
 * - GenerateTournamentWizardInput - The input type for the function.
 * - GenerateTournamentWizardOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateTournamentDetails} from './generate-tournament-details-flow';
import {generateTournamentImage} from './generate-tournament-image-flow';


export const GenerateTournamentWizardInputSchema = z.object({
  prompt: z.string().describe('A simple text prompt describing the tournament idea, e.g., "Weekly Valorant tournament for amateurs".'),
});
export type GenerateTournamentWizardInput = z.infer<typeof GenerateTournamentWizardInputSchema>;

export const GenerateTournamentWizardOutputSchema = z.object({
  name: z.string().describe('The generated name of the tournament.'),
  description: z.string().describe('A short, exciting description for the tournament announcement.'),
  imageDataUri: z.string().describe("The generated tournament banner image as a data URI."),
  prizePool: z.string().describe("A suggested prize pool structure."),
  schedule: z.string().describe("A suggested schedule for the tournament."),
});
export type GenerateTournamentWizardOutput = z.infer<typeof GenerateTournamentWizardOutputSchema>;


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
