'use server';
/**
 * @fileOverview An AI agent for generating a daily challenge for a sports playground.
 *
 * - generatePlaygroundChallenge - A function that handles the challenge generation.
 * - GeneratePlaygroundChallengeInput - The input type for the function.
 * - GeneratePlaygroundChallengeOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { GeneratePlaygroundChallengeInputSchema, GeneratePlaygroundChallengeOutputSchema } from './schemas/generate-playground-challenge-schema';
import type { GeneratePlaygroundChallengeInput, GeneratePlaygroundChallengeOutput } from './schemas/generate-playground-challenge-schema';

export type { GeneratePlaygroundChallengeInput, GeneratePlaygroundChallengeOutput };

export async function generatePlaygroundChallenge(input: GeneratePlaygroundChallengeInput): Promise<GeneratePlaygroundChallengeOutput> {
  return generatePlaygroundChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaygroundChallengePrompt',
  input: { schema: GeneratePlaygroundChallengeInputSchema },
  output: { schema: GeneratePlaygroundChallengeOutputSchema },
  prompt: `You are a creative game master for a sports platform. Your task is to generate a simple, fun, daily skill challenge for a user visiting a specific playground. The challenge should be relevant to the playground's sport type.

  Playground Details:
  - Name: {{{playgroundName}}}
  - Sport: {{{playgroundType}}}

  Instructions:
  1.  Create a catchy title for the challenge.
  2.  Write a clear, one-sentence description of the task. The task should be something a user can realistically do and track themselves (e.g., 'Сделай 10 точных трехочковых бросков подряд', 'Забей 5 голов с пенальти').
  3.  Assign a fair reward in PD (ProDvor Dollars), typically between 10 and 50.

  Respond in Russian. The tone should be motivating and fun.
  `,
});

const generatePlaygroundChallengeFlow = ai.defineFlow(
  {
    name: 'generatePlaygroundChallengeFlow',
    inputSchema: GeneratePlaygroundChallengeInputSchema,
    outputSchema: GeneratePlaygroundChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a challenge.");
    }
    return output;
  }
);
