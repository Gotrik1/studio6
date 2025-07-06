"use server";
/**
 * @fileOverview An AI agent for generating a personalized skill drill for a user on a specific playground.
 *
 * - generatePlaygroundDrill - A function that handles the drill generation.
 * - GeneratePlaygroundDrillInput - The input type for the function.
 * - GeneratePlaygroundDrillOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GeneratePlaygroundDrillInputSchema,
  GeneratePlaygroundDrillOutputSchema,
} from "./schemas/generate-playground-drill-schema";
import type {
  GeneratePlaygroundDrillInput,
  GeneratePlaygroundDrillOutput,
} from "./schemas/generate-playground-drill-schema";

export type { GeneratePlaygroundDrillInput, GeneratePlaygroundDrillOutput };

export async function generatePlaygroundDrill(
  input: GeneratePlaygroundDrillInput,
): Promise<GeneratePlaygroundDrillOutput> {
  return generatePlaygroundDrillFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "generatePlaygroundDrillPrompt_Backend",
  input: { schema: GeneratePlaygroundDrillInputSchema },
  output: { schema: GeneratePlaygroundDrillOutputSchema },
  prompt: `You are an expert personal sports coach. A player is at a '{{{playgroundType}}}' playground and wants to work on a specific weakness.

  Player's Weakness: "{{{userWeakness}}}"

  Instructions:
  1.  Create a catchy, motivating title for a skill drill that targets this weakness.
  2.  Write a clear, one-sentence description of a specific, measurable task the player can perform right now on this playground.
  3.  Assign a fair reward in PD for completing the drill, typically between 25 and 75 PD.

  Respond in Russian. The tone should be encouraging and direct.
  `,
});

const generatePlaygroundDrillFlow_Backend = ai.defineFlow(
  {
    name: "generatePlaygroundDrillFlow_Backend",
    inputSchema: GeneratePlaygroundDrillInputSchema,
    outputSchema: GeneratePlaygroundDrillOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a skill drill.");
    }
    return output;
  },
);
