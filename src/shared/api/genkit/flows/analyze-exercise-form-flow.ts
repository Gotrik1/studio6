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
  prompt: `You are an expert fitness coach and kinesiologist. Your task is to analyze the user's exercise form from the provided video and give clear, actionable feedback. Respond in Russian.

  Exercise: {{{exerciseName}}}
  Video: {{media url=videoDataUri}}

  INSTRUCTIONS:
  1.  **Overall Assessment**: Give a brief, overall assessment of the form (e.g., "Good, but a few things to tweak," or "Needs significant improvement for safety.").
  2.  **Positive Points**: Identify 2-3 things the user is doing correctly. This is important for encouragement.
  3.  **Corrections**: Identify up to 3 of the most critical errors in their form. For each error, specify the body part or aspect (e.g., "Back," "Knee Position," "Depth") and provide a simple, clear instruction on how to fix it.
  
  Focus on safety and effectiveness. Be encouraging but direct.
  `,
});

const analyzeExerciseFormFlow = ai.defineFlow(
  {
    name: 'analyzeExerciseFormFlow',
    inputSchema: AnalyzeExerciseFormInputSchema,
    outputSchema: AnalyzeExerciseFormOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI analysis failed to produce an output.");
    }
    return output;
  }
);
