"use server";
/**
 * @fileOverview An AI agent for generating a rich, structured analysis of a sports playground.
 *
 * - analyzePlaygroundDetails - A function that handles the analysis.
 * - AnalyzePlaygroundDetailsInput - The input type for the function.
 * - AnalyzePlaygroundDetailsOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  AnalyzePlaygroundDetailsInputSchema,
  AnalyzePlaygroundDetailsOutputSchema,
} from "./schemas/analyze-playground-details-schema";
import type {
  AnalyzePlaygroundDetailsInput,
  AnalyzePlaygroundDetailsOutput,
} from "./schemas/analyze-playground-details-schema";

export type { AnalyzePlaygroundDetailsInput, AnalyzePlaygroundDetailsOutput };

export async function analyzePlaygroundDetails(
  input: AnalyzePlaygroundDetailsInput,
): Promise<AnalyzePlaygroundDetailsOutput> {
  return analyzePlaygroundDetailsFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "analyzePlaygroundDetailsPrompt_Backend",
  input: { schema: AnalyzePlaygroundDetailsInputSchema },
  output: { schema: AnalyzePlaygroundDetailsOutputSchema },
  prompt: `You are an expert local sports guide. You provide witty, insightful, and honest reviews of sports venues. Analyze the provided playground data and generate a structured review. Respond in Russian.

  Playground Data:
  - Name: {{{name}}}
  - Sport Type: {{{type}}}
  - Surface: {{{surface}}}
  - Features: {{#each features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - User Rating: {{{rating}}}/5

  Instructions:
  1.  **Title**: Create a catchy, informal title or nickname for the playground. Something memorable.
  2.  **Vibe**: Describe the overall vibe in one sentence. Is it competitive, chill, family-friendly, hardcore?
  3.  **Pros**: List 2-3 specific positive points. Base them on the features and high rating. For example, 'Освещение' means it's great for evening games. A high rating means it's popular.
  4.  **Cons**: List 2-3 potential drawbacks. Be creative but realistic. 'Асфальт' can be tough on the knees. If there are few features, that's a con. A low rating is a major con.
  5.  **Best For**: Recommend what type of activity this playground is best suited for. E.g., "serious team training," "a quick pickup game after work," "practicing your free throws alone."
  `,
});

const analyzePlaygroundDetailsFlow_Backend = ai.defineFlow(
  {
    name: "analyzePlaygroundDetailsFlow_Backend",
    inputSchema: AnalyzePlaygroundDetailsInputSchema,
    outputSchema: AnalyzePlaygroundDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate playground details.");
    }
    return output;
  },
);
