'use server';

/**
 * @fileOverview An AI agent for generating a complete tournament concept from a single prompt.
 *
 * - generateTournamentWizard - A function that handles the generation.
 * - GenerateTournamentWizardInput - The input type for the function.
 * - GenerateTournamentWizardOutput - The return type for the function.
 */

import { ai } from '../genkit';
import {z} from 'genkit';
import { GenerateTournamentWizardInputSchema, GenerateTournamentWizardOutputSchema } from './schemas/generate-tournament-wizard-schema';
import type { GenerateTournamentWizardInput, GenerateTournamentWizardOutput } from './schemas/generate-tournament-wizard-schema';

export type { GenerateTournamentWizardInput, GenerateTournamentWizardOutput };


export async function generateTournamentWizard(input: GenerateTournamentWizardInput): Promise<GenerateTournamentWizardOutput> {
  return generateTournamentWizardFlow_Backend(input);
}

// Internal function for image generation to avoid a separate flow call.
async function generateTournamentImage_internal(prompt: string): Promise<string> {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A professional and exciting sports tournament banner for a tournament about: ${prompt}. Epic, cinematic, digital art style.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    
    if (!media?.url) {
        throw new Error('Image generation failed.');
    }
    
    return media.url;
}

// A new, combined prompt to generate all text content at once.
const generateTournamentDetailsPrompt = ai.definePrompt({
    name: 'generateTournamentAllDetailsPrompt',
    input: { schema: z.string() },
    output: { schema: z.object({
        name: z.string().describe('A creative and exciting name for the tournament.'),
        description: z.string().describe('A short, punchy description for the tournament announcement.'),
        prizePool: z.string().describe("A suggested prize pool structure with 3 tiers."),
        schedule: z.string().describe("A suggested schedule with key dates (Registration, Group Stage, Finals)."),
    })},
    prompt: `You are an exciting esports announcer. Based on the following idea, generate a creative tournament name, a short, punchy description, a simple prize pool, and a weekly schedule. All output must be in Russian.
    
    Tournament Idea: {{{input}}}
    
    - Prize Pool: List 3 prize tiers (e.g., 1st, 2nd, 3rd place) with appropriate rewards (can be money or in-game items).
    - Schedule: List key dates (e.g., Registration Closes, Group Stage, Finals).
    Keep it concise and formatted with clear headings.
    `
});


const generateTournamentWizardFlow_Backend = ai.defineFlow(
  {
    name: 'generateTournamentWizardFlow_Backend',
    inputSchema: GenerateTournamentWizardInputSchema,
    outputSchema: GenerateTournamentWizardOutputSchema,
  },
  async ({ prompt }) => {

    // Generate all text details and the image in parallel
    const [detailsResult, imageDataUri] = await Promise.all([
        generateTournamentDetailsPrompt(prompt),
        generateTournamentImage_internal(prompt),
    ]);

    const detailsOutput = detailsResult.output;
    if (!detailsOutput) {
        throw new Error("Failed to generate tournament details.");
    }

    return {
        name: detailsOutput.name,
        description: detailsOutput.description,
        imageDataUri,
        prizePool: detailsOutput.prizePool,
        schedule: detailsOutput.schedule,
    };
  }
);
