
'use server';
/**
 * @fileOverview An AI agent for analyzing individual player physical performance.
 *
 * - analyzePlayerPerformance - A function that handles the analysis.
 * - AnalyzePlayerPerformanceInput - The input type for the function.
 * - AnalyzePlayerPerformanceOutput - The return type for the function.
 */

import {ai} from '@genkit-ai/next';
import { AnalyzePlayerPerformanceInputSchema, AnalyzePlayerPerformanceOutputSchema } from './schemas/analyze-player-performance-schema';
import type { AnalyzePlayerPerformanceInput, AnalyzePlayerPerformanceOutput } from './schemas/analyze-player-performance-schema';

export type { AnalyzePlayerPerformanceInput, AnalyzePlayerPerformanceOutput };


export async function analyzePlayerPerformance(input: AnalyzePlayerPerformanceInput): Promise<AnalyzePlayerPerformanceOutput> {
  return analyzePlayerPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePlayerPerformancePrompt',
  input: {schema: AnalyzePlayerPerformanceInputSchema},
  output: {schema: AnalyzePlayerPerformanceOutputSchema},
  prompt: `You are an expert fitness and strength coach. Analyze the provided training summary and recent workout logs to identify key strengths and weaknesses. Respond in Russian.

Training Summary:
{{{trainingSummary}}}

Recent Workouts Log:
{{{recentWorkouts}}}

Please provide a concise analysis. Identify which muscle groups are lagging or progressing well. ONLY identify strengths and weaknesses. Do not provide recommendations.
`,
});

const analyzePlayerPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzePlayerPerformanceFlow',
    inputSchema: AnalyzePlayerPerformanceInputSchema,
    outputSchema: AnalyzePlayerPerformanceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
