"use server";
/**
 * @fileOverview An AI agent for generating a summary for a sport.
 *
 * - generateSportSummary - A function that handles the summary generation.
 * - GenerateSportSummaryInput - The input type for the function.
 * - GenerateSportSummaryOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GenerateSportSummaryInputSchema,
  GenerateSportSummaryOutputSchema,
} from "./schemas/generate-sport-summary-schema";
import type {
  GenerateSportSummaryInput,
  GenerateSportSummaryOutput,
} from "./schemas/generate-sport-summary-schema";

export type { GenerateSportSummaryInput, GenerateSportSummaryOutput };

export async function generateSportSummary(
  input: GenerateSportSummaryInput,
): Promise<GenerateSportSummaryOutput> {
  return generateSportSummaryFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "generateSportSummaryPrompt_Backend",
  input: { schema: GenerateSportSummaryInputSchema },
  output: { schema: GenerateSportSummaryOutputSchema },
  prompt: `You are a sports encyclopedia. Generate a short, engaging summary for the sport: {{{sportName}}}.

  Your response should include:
  - A brief summary of the sport's origin and objective.
  - A fun, little-known fact about the sport.

  Keep the language accessible and exciting for fans. Respond in Russian.`,
});

const generateSportSummaryFlow_Backend = ai.defineFlow(
  {
    name: "generateSportSummaryFlow_Backend",
    inputSchema: GenerateSportSummaryInputSchema,
    outputSchema: GenerateSportSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
