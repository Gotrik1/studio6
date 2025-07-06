"use server";
/**
 * @fileOverview An AI agent for generating a daily challenge for a sports playground.
 *
 * - generatePlaygroundChallenge - A function that handles the challenge generation.
 * - GeneratePlaygroundChallengeInput - The input type for the function.
 * - GeneratePlaygroundChallengeOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GeneratePlaygroundChallengeInputSchema,
  GeneratePlaygroundChallengeOutputSchema,
} from "./schemas/generate-playground-challenge-schema";
import type {
  GeneratePlaygroundChallengeInput,
  GeneratePlaygroundChallengeOutput,
} from "./schemas/generate-playground-challenge-schema";

export type {
  GeneratePlaygroundChallengeInput,
  GeneratePlaygroundChallengeOutput,
};

export async function generatePlaygroundChallenge(
  input: GeneratePlaygroundChallengeInput,
): Promise<GeneratePlaygroundChallengeOutput> {
  return generatePlaygroundChallengeFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "generatePlaygroundChallengePrompt_Backend",
  input: { schema: GeneratePlaygroundChallengeInputSchema },
  output: { schema: GeneratePlaygroundChallengeOutputSchema },
  prompt: `You are a creative game master for a sports platform. Your task is to generate a simple, fun, daily skill challenge for a user visiting a specific playground. The challenge should be relevant to the playground's sport type.

  Playground Details:
  - Name: {{{playgroundName}}}
  - Sport: {{{playgroundType}}}
  - King of the Court: {{{topPlayerName}}} ({{{topPlayerStat}}})

  Instructions:
  1.  Create a catchy title for the challenge. You can mention the top player, e.g., "Вызов от Короля".
  2.  Write a clear, one-sentence description of the task. The task should be something a user can realistically do and track themselves. Sometimes, it can be related to beating the top player's record. Examples: 'Сделай 10 точных трехочковых бросков подряд', 'Забей 5 голов с пенальти', 'Продержись в планке дольше, чем Король {{{topPlayerName}}} (его рекорд 3 минуты)'.
  3.  Assign a fair reward in PD, typically between 10 and 50.

  Respond in Russian. The tone should be motivating and fun.
  `,
});

const generatePlaygroundChallengeFlow_Backend = ai.defineFlow(
  {
    name: "generatePlaygroundChallengeFlow_Backend",
    inputSchema: GeneratePlaygroundChallengeInputSchema,
    outputSchema: GeneratePlaygroundChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a challenge.");
    }
    return output;
  },
);
