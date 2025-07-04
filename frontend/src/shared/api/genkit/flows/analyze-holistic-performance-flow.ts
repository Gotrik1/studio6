
'use server';
/**
 * @fileOverview An AI agent for a holistic analysis of physical and esports performance.
 *
 * - analyzeHolisticPerformance - A function that handles the analysis.
 * - AnalyzeHolisticPerformanceInput - The input type for the function.
 * - AnalyzeHolisticPerformanceOutput - The return type for the function.
 */

import {ai} from '@genkit-ai/next';
import { AnalyzeHolisticPerformanceInputSchema, AnalyzeHolisticPerformanceOutputSchema } from './schemas/analyze-holistic-performance-schema';
import type { AnalyzeHolisticPerformanceInput, AnalyzeHolisticPerformanceOutput } from './schemas/analyze-holistic-performance-schema';

export type { AnalyzeHolisticPerformanceInput, AnalyzeHolisticPerformanceOutput };


export async function analyzeHolisticPerformance(input: AnalyzeHolisticPerformanceInput): Promise<AnalyzeHolisticPerformanceOutput> {
  return analyzeHolisticPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeHolisticPerformancePrompt',
  input: {schema: AnalyzeHolisticPerformanceInputSchema},
  output: {schema: AnalyzeHolisticPerformanceOutputSchema},
  prompt: `You are an expert sports scientist and esports performance coach. Your task is to perform a holistic analysis of a player, finding correlations between their physical training and their esports performance.

  PLAYER DATA:
  - Physical Training Summary: {{{physicalSummary}}}
  - Esports Performance Summary: {{{esportsSummary}}}

  INSTRUCTIONS:
  1.  Provide a brief, overall assessment of the player's condition.
  2.  Identify 1-2 interesting correlations (positive or negative) between their physical and gaming activities. For example, "win rate increases after cardio sessions" or "reaction time decreases when skipping leg day". Provide a possible explanation for each.
  3.  Provide 2-3 actionable recommendations that leverage these correlations to improve overall performance.

  Respond in Russian. The tone should be professional, encouraging, and data-driven.
`,
});

const analyzeHolisticPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeHolisticPerformanceFlow',
    inputSchema: AnalyzeHolisticPerformanceInputSchema,
    outputSchema: AnalyzeHolisticPerformanceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
