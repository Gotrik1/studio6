'use server';

/**
 * @fileOverview An AI agent for analyzing a player's performance and providing coaching advice.
 *
 * - analyzePlayerPerformance - A function that handles the performance analysis process.
 * - AnalyzePlayerPerformanceInput - The input type for the function.
 * - AnalyzePlayerPerformanceOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import {z} from 'genkit';
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
  prompt: `You are an expert esports coach specializing in Valorant. Analyze the provided player statistics and match history.

  Your goal is to provide a concise and helpful analysis. Identify 2-3 key strengths, 2-3 key weaknesses, and provide 3 concrete, actionable recommendations for improvement.

  Player Statistics:
  {{{playerStats}}}

  Recent Match History:
  {{{matchHistory}}}
  `,
});

const analyzePlayerPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzePlayerPerformanceFlow',
    inputSchema: AnalyzePlayerPerformanceInputSchema,
    outputSchema: AnalyzePlayerPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
