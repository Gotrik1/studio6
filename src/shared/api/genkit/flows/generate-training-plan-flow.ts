
'use server';
/**
 * @fileOverview An AI agent for generating a personalized training plan for a player.
 *
 * - generateTrainingPlan - A function that handles the training plan generation.
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
  prompt: `You are an expert sports coach. Based on the provided player analysis, create a personalized, actionable 1-week training plan. The plan should be concise and focus on improving the player's weaknesses while leveraging their strengths. The player's role is {{{playerRole}}}.

  Player Analysis:
  Strengths:
  {{#each analysis.strengths}}
  - {{this}}
  {{/each}}

  Weaknesses:
  {{#each analysis.weaknesses}}
  - {{this}}
  {{/each}}

  Generate a training plan with a clear weekly focus, specific drills, links to helpful (but fake) video guides, and a measurable goal for the week.
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
