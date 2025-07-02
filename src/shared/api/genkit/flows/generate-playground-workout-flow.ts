'use server';
/**
 * @fileOverview An AI agent for generating workout routines for sports playgrounds.
 *
 * - generatePlaygroundWorkout - A function that handles workout generation.
 * - GeneratePlaygroundWorkoutInput - The input type for the function.
 * - GeneratePlaygroundWorkoutOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { GeneratePlaygroundWorkoutInputSchema, GeneratePlaygroundWorkoutOutputSchema } from './schemas/generate-playground-workout-schema';
import type { GeneratePlaygroundWorkoutInput, GeneratePlaygroundWorkoutOutput } from './schemas/generate-playground-workout-schema';

export type { GeneratePlaygroundWorkoutInput, GeneratePlaygroundWorkoutOutput };

export async function generatePlaygroundWorkout(input: GeneratePlaygroundWorkoutInput): Promise<GeneratePlaygroundWorkoutOutput> {
  return generatePlaygroundWorkoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaygroundWorkoutPrompt',
  input: { schema: GeneratePlaygroundWorkoutInputSchema },
  output: { schema: GeneratePlaygroundWorkoutOutputSchema },
  prompt: `You are an expert street workout and calisthenics coach. Create a balanced, effective workout routine based on the available equipment. The language must be Russian.

  Available Equipment:
  {{#each equipment}}
  - {{{this}}}
  {{/each}}

  Instructions:
  1.  Create a catchy, motivating title for the workout.
  2.  Write a short, one-sentence description of the workout's focus (e.g., "Full-body" or "Upper body strength").
  3.  Generate a list of 4-5 exercises using ONLY the available equipment. If no equipment is listed, suggest bodyweight exercises.
  4.  For each exercise, provide a reasonable number of sets and reps for an intermediate athlete. Use ranges (e.g., "3-4" sets, "10-15" reps).

  Keep it simple, clear, and effective.
  `,
});

const generatePlaygroundWorkoutFlow = ai.defineFlow(
  {
    name: 'generatePlaygroundWorkoutFlow',
    inputSchema: GeneratePlaygroundWorkoutInputSchema,
    outputSchema: GeneratePlaygroundWorkoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a workout.");
    }
    return output;
  }
);
