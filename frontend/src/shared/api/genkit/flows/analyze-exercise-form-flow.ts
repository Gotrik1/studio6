
'use server';
/**
 * @fileOverview An AI agent for analyzing a user's exercise form from a video.
 *
 * - analyzeExerciseForm - a function that handles the form analysis.
 * - AnalyzeExerciseFormInput - The input type for the function.
 * - AnalyzeExerciseFormOutput - The return type for the function.
 */

import {ai} from '@genkit-ai/next';
import { AnalyzeExerciseFormInputSchema, AnalyzeExerciseFormOutputSchema } from './schemas/analyze-exercise-form-schema';
import type { AnalyzeExerciseFormInput, AnalyzeExerciseFormOutput } from './schemas/analyze-exercise-form-schema';

export type { AnalyzeExerciseFormInput, AnalyzeExerciseFormOutput };


export async function analyzeExerciseForm(input: AnalyzeExerciseFormInput): Promise<AnalyzeExerciseFormOutput> {
  return analyzeExerciseFormFlow(input);
}

const prompt = ai.definePrompt({
    name: 'analyzeExerciseFormPrompt',
    input: { schema: AnalyzeExerciseFormInputSchema },
    output: { schema: AnalyzeExerciseFormOutputSchema },
    prompt: `You are an expert fitness coach and biomechanics specialist.
Analyze the user's exercise form in the provided video. The user is performing: {{{exerciseName}}}.

Based on the video, provide the following in Russian:
1.  **overallAssessment**: A brief, overall assessment of the exercise form.
2.  **corrections**: A list of specific mistakes found and how to correct them. Identify the body part and the specific correction needed. Be very precise.
3.  **positivePoints**: A list of things the person did correctly to provide positive reinforcement.

Video of the user's exercise form:
{{media url=videoDataUri}}
`
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
      throw new Error("AI failed to generate exercise form analysis.");
    }
    return output;
  }
);
