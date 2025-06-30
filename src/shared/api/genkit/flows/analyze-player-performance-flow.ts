'use server';
/**
 * @fileOverview An AI agent for analyzing individual player performance.
 *
 * - analyzePlayerPerformance - A function that handles the analysis.
 * - AnalyzePlayerPerformanceInput - The input type for the function.
 * - AnalyzePlayerPerformanceOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
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
  prompt: `You are an expert esports coach. Analyze the provided player statistics and match history to identify key strengths, weaknesses, and provide actionable recommendations.

Player Stats: {{{playerStats}}}

Match History:
{{{matchHistory}}}

Please provide a concise analysis, focusing on clear, actionable feedback.
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
