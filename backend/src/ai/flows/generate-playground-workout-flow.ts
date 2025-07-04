'use server';
/**
 * @fileOverview An AI agent for generating workout routines for sports playgrounds.
 *
 * - generatePlaygroundWorkout - A function that handles workout generation.
 * - GeneratePlaygroundWorkoutInput - The input type for the function.
 * - GeneratePlaygroundWorkoutOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { GeneratePlaygroundWorkoutInputSchema, GeneratePlaygroundWorkoutOutputSchema } from './schemas/generate-playground-workout-schema';
import type { GeneratePlaygroundWorkoutInput, GeneratePlaygroundWorkoutOutput } from './schemas/generate-playground-workout-schema';

export type { GeneratePlaygroundWorkoutInput, GeneratePlaygroundWorkoutOutput };

export async function generatePlaygroundWorkout(input: GeneratePlaygroundWorkoutInput): Promise<GeneratePlaygroundWorkoutOutput> {
  return generatePlaygroundWorkoutFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaygroundWorkoutPrompt_Backend',
  input: { schema: GeneratePlaygroundWorkoutInputSchema },
  output: { schema: GeneratePlaygroundWorkoutOutputSchema },
  prompt: `You are an expert AI sports coach. Your task is to create a workout or drill routine tailored to the specific type of playground and its available equipment. Respond in Russian.

  Playground Type: {{{playgroundType}}}
  Available Equipment:
  {{#each equipment}}
  - {{{this}}}
  {{/each}}

  Instructions:
  1.  Create a catchy, motivating title for the routine.
  2.  Write a short, one-sentence description of the routine's focus.
  3.  Based on the Playground Type, generate an appropriate routine:
      - If the type is 'Воркаут' or 'Фитнес-зал', create a strength or conditioning workout with 4-5 exercises.
      - If the type is 'Футбол', 'Баскетбол', or another team sport, create a skill drill session with 3-4 drills.
      - If the type is for individual sports like 'Теннисный корт' or 'Легкая атлетика', create a focused practice session.
  4.  For each exercise or drill, provide a reasonable number of sets/reps or a duration.

  Keep it simple, clear, and effective.
  `,
});

const generatePlaygroundWorkoutFlow_Backend = ai.defineFlow(
  {
    name: 'generatePlaygroundWorkoutFlow_Backend',
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
