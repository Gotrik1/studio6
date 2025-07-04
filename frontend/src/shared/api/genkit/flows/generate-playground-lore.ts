'use server';
/**
 * @fileOverview An AI agent for generating lore or history for a sports playground.
 *
 * - generatePlaygroundLore - A function that handles the lore generation.
 * - GeneratePlaygroundLoreInput - The input type for the function.
 * - GeneratePlaygroundLoreOutput - The return type for the function.
 */

import { ai } from '@genkit-ai/next';
import { GeneratePlaygroundLoreInputSchema, GeneratePlaygroundLoreOutputSchema } from './schemas/generate-playground-lore-schema';
import type { GeneratePlaygroundLoreInput, GeneratePlaygroundLoreOutput } from './schemas/generate-playground-lore-schema';

export type { GeneratePlaygroundLoreInput, GeneratePlaygroundLoreOutput };

export async function generatePlaygroundLore(input: GeneratePlaygroundLoreInput): Promise<GeneratePlaygroundLoreOutput> {
  return generatePlaygroundLoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaygroundLorePrompt',
  input: { schema: GeneratePlaygroundLoreInputSchema },
  output: { schema: GeneratePlaygroundLoreOutputSchema },
  prompt: `You are a creative storyteller and sports historian for the ProDvor platform. Your task is to write a short, epic piece of "lore" for a specific playground based on its activity.
  Make it sound legendary and fun.

  Playground Data:
  - Name: {{{playgroundName}}}
  - Top Player (King of the Court): {{{topPlayer}}}
  - Most Frequent Team: {{{topTeam}}}
  - Всего отметок: {{{checkIns}}}

  Instructions:
  - Weave a story around the provided data.
  - Give the playground a cool nickname based on its history (e.g., "The Fortress of {{{topTeam}}}").
  - Mention the "legend" of {{{topPlayer}}}.
  - Keep it to 2-3 sentences.
  - Respond in Russian.
  `,
});

const generatePlaygroundLoreFlow = ai.defineFlow(
  {
    name: 'generatePlaygroundLoreFlow',
    inputSchema: GeneratePlaygroundLoreInputSchema,
    outputSchema: GeneratePlaygroundLoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate lore.");
    }
    return output;
  }
);
