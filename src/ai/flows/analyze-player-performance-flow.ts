'use server';

/**
 * @fileOverview An AI agent for analyzing a player's performance and providing coaching advice.
 *
 * - analyzePlayerPerformance - A function that handles the performance analysis process.
 * - AnalyzePlayerPerformanceInput - The input type for the function.
 * - AnalyzePlayerPerformanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzePlayerPerformanceInputSchema = z.object({
  playerStats: z.string().describe("A summary of the player's key statistics (e.g., KDA, win rate, favorite map)."),
  matchHistory: z.string().describe("A log of the player's recent matches, including results and scores."),
});
export type AnalyzePlayerPerformanceInput = z.infer<typeof AnalyzePlayerPerformanceInputSchema>;

export const AnalyzePlayerPerformanceOutputSchema = z.object({
  strengths: z.array(z.string()).describe("A list of the player's key strengths identified from the data."),
  weaknesses: z.array(z.string()).describe("A list of the player's key weaknesses identified from the data."),
  recommendations: z.array(z.string()).describe("A list of actionable recommendations for the player to improve their game."),
});
export type AnalyzePlayerPerformanceOutput = z.infer<typeof AnalyzePlayerPerformanceOutputSchema>;

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
