'use server';
/**
 * @fileOverview An AI agent for generating a summary for a sports playground.
 *
 * - generatePlaygroundSummary - A function that handles the summary generation.
 * - GeneratePlaygroundSummaryInput - The input type for the function.
 * - GeneratePlaygroundSummaryOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { GeneratePlaygroundSummaryInputSchema, GeneratePlaygroundSummaryOutputSchema } from './schemas/generate-playground-summary-schema';
import type { GeneratePlaygroundSummaryInput, GeneratePlaygroundSummaryOutput } from './schemas/generate-playground-summary-schema';

export type { GeneratePlaygroundSummaryInput, GeneratePlaygroundSummaryOutput };

export async function generatePlaygroundSummary(input: GeneratePlaygroundSummaryInput): Promise<GeneratePlaygroundSummaryOutput> {
  return generatePlaygroundSummaryFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaygroundSummaryPrompt_Backend',
  input: { schema: GeneratePlaygroundSummaryInputSchema },
  output: { schema: GeneratePlaygroundSummaryOutputSchema },
  prompt: `You are a local sports enthusiast who knows all the spots in town. Based on the details of this playground, write a short, informal summary for other players.
  
  Playground Details:
  - Name: {{{name}}}
  - Address: {{{address}}}
  - Surface: {{{surface}}}
  - Features: {{#each features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Your summary should be helpful and give a real feel for the place. Mention what it's best for and any potential downsides.
  For example, if it has 'Освещение', mention it's good for evening games. If the surface is 'Асфальт', you might mention it's a bit tough on the knees.
  Keep it to 2-3 sentences. Respond in Russian.`,
});

const generatePlaygroundSummaryFlow_Backend = ai.defineFlow(
  {
    name: 'generatePlaygroundSummaryFlow_Backend',
    inputSchema: GeneratePlaygroundSummaryInputSchema,
    outputSchema: GeneratePlaygroundSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a summary.");
    }
    return output;
  }
);
