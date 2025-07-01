'use server';
/**
 * @fileOverview An AI agent for analyzing a user's exercise form from a video.
 *
 * - analyzeExerciseForm - A function that handles the form analysis.
 * - AnalyzeExerciseFormInput - The input type for the function.
 * - AnalyzeExerciseFormOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { AnalyzeExerciseFormInputSchema, AnalyzeExerciseFormOutputSchema } from './schemas/analyze-exercise-form-schema';
import type { AnalyzeExerciseFormInput, AnalyzeExerciseFormOutput } from './schemas/analyze-exercise-form-schema';

export type { AnalyzeExerciseFormInput, AnalyzeExerciseFormOutput };


export async function analyzeExerciseForm(input: AnalyzeExerciseFormInput): Promise<AnalyzeExerciseFormOutput> {
  return analyzeExerciseFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeExerciseFormPrompt',
  input: {schema: AnalyzeExerciseFormInputSchema},
  output: {schema: AnalyzeExerciseFormOutputSchema},
  prompt: `You are an expert personal trainer and biomechanics specialist. Analyze the user's form in the provided video for the exercise: {{{exerciseName}}}.

  Your task is to:
  1. Provide a brief, overall assessment of the form.
  2. Identify specific mistakes in their technique. For each mistake, name the body part or aspect of the form and provide a clear, actionable correction.
  3. Identify 1-2 key things the user is doing correctly to provide positive reinforcement.

  Respond in Russian.

  Here is the video:
  {{media url=videoDataUri}}
  `,
});

const analyzeExerciseFormFlow = ai.defineFlow(
  {
    name: 'analyzeExerciseFormFlow',
    inputSchema: AnalyzeExerciseFormInputSchema,
    outputSchema: AnalyzeExerciseFormOutputSchema,
  },
  async (input) => {
    // --- This is the code that would run in a real scenario ---
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI analysis failed to produce an output.");
    }
    return output;
  }
);
