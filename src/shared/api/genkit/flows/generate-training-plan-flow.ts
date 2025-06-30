'use server';

/**
 * @fileOverview An AI agent for generating a personalized training plan based on performance analysis.
 *
 * - generateTrainingPlan - A function that handles plan generation.
 * - GenerateTrainingPlanInput - The input type for the function.
 * - GenerateTrainingPlanOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { GenerateTrainingPlanInputSchema, GenerateTrainingPlanOutputSchema } from './schemas/generate-training-plan-schema';
import type { GenerateTrainingPlanInput, GenerateTrainingPlanOutput } from './schemas/generate-training-plan-schema';

export type { GenerateTrainingPlanInput, GenerateTrainingPlanOutput };


export async function generateTrainingPlan(input: GenerateTrainingPlanInput): Promise<GenerateTrainingPlanOutput> {
  return generateTrainingPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrainingPlanPrompt',
  input: {schema: GenerateTrainingPlanInputSchema},
  output: {schema: GenerateTrainingPlanOutputSchema},
  prompt: `You are an expert esports coach. You have just analyzed a player's performance. Now, create a concrete, actionable training plan for them for the next week.

  PLAYER ANALYSIS:
  - Strengths: {{analysis.strengths}}
  - Weaknesses: {{analysis.weaknesses}}
  - Role: {{playerRole}}

  TASKS:
  1.  **Weekly Focus**: Based on the weaknesses, define one primary focus for the week.
  2.  **Drills**: Suggest 2-3 specific in-game drills or practice routines to address the focus.
  3.  **Video Suggestions**: Find 1-2 relevant YouTube video titles and URLs that could help the player (these can be hypothetical but realistic URLs).
  4.  **Weekly Goal**: Set a specific, measurable goal for the player to achieve by the end of the week.

  Make the plan motivating and easy to follow.
  `,
});

const generateTrainingPlanFlow = ai.defineFlow(
  {
    name: 'generateTrainingPlanFlow',
    inputSchema: GenerateTrainingPlanInputSchema,
    outputSchema: GenerateTrainingPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
