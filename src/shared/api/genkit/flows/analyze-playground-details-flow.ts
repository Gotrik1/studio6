'use server';
/**
 * @fileOverview An AI agent for analyzing playground details to create a rich summary.
 *
 * - analyzePlaygroundDetails - A function that handles the analysis.
 * - AnalyzePlaygroundDetailsInput - The input type for the function.
 * - AnalyzePlaygroundDetailsOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { AnalyzePlaygroundDetailsInputSchema, AnalyzePlaygroundDetailsOutputSchema } from './schemas/analyze-playground-details-schema';
import type { AnalyzePlaygroundDetailsInput, AnalyzePlaygroundDetailsOutput } from './schemas/analyze-playground-details-schema';

export type { AnalyzePlaygroundDetailsInput, AnalyzePlaygroundDetailsOutput };

export async function analyzePlaygroundDetails(input: AnalyzePlaygroundDetailsInput): Promise<AnalyzePlaygroundDetailsOutput> {
  return analyzePlaygroundDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlaygroundDetailsPrompt',
  input: { schema: AnalyzePlaygroundDetailsInputSchema },
  output: { schema: AnalyzePlaygroundDetailsOutputSchema },
  prompt: `You are a local sports guru and community guide. Analyze the provided data for a sports playground and create a rich, structured summary for other players. Respond in Russian.

  Playground Data:
  - Name: {{{name}}}
  - Type: {{{type}}}
  - Surface: {{{surface}}}
  - Features: {{#each features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - User Rating: {{{rating}}} / 5

  Instructions:
  1.  **Title**: Give the playground a catchy, informal nickname.
  2.  **Vibe**: Describe the general atmosphere in one sentence. Is it competitive, family-friendly, hardcore?
  3.  **Pros**: List 2-3 main advantages. Consider features like "Освещение" for evening games or "Резина" surface for safety.
  4.  **Cons**: List 2-3 potential drawbacks. Consider "Асфальт" surface (hard on joints), or lack of features. A high rating might mean it gets crowded.
  5.  **Best For**: Suggest what this place is best for (e.g., "Идеально для вечерних игр 3x3", "Отлично для серьезных тренировок по воркауту").

  Be creative and helpful. Your goal is to give a real feel for the place.
  `,
});

const analyzePlaygroundDetailsFlow = ai.defineFlow(
  {
    name: 'analyzePlaygroundDetailsFlow',
    inputSchema: AnalyzePlaygroundDetailsInputSchema,
    outputSchema: AnalyzePlaygroundDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to analyze playground details.");
    }
    return output;
  }
);
