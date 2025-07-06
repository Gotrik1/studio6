"use server";
/**
 * @fileOverview An AI agent for analyzing individual player eSports performance.
 *
 * - analyzeEsportsPerformance - A function that handles the analysis.
 * - AnalyzeEsportsPerformanceInput - The input type for the function.
 * - AnalyzeEsportsPerformanceOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  AnalyzeEsportsPerformanceInputSchema,
  AnalyzeEsportsPerformanceOutputSchema,
} from "./schemas/analyze-esports-performance-schema";
import type {
  AnalyzeEsportsPerformanceInput,
  AnalyzeEsportsPerformanceOutput,
} from "./schemas/analyze-esports-performance-schema";

export type { AnalyzeEsportsPerformanceInput, AnalyzeEsportsPerformanceOutput };

export async function analyzeEsportsPerformance(
  input: AnalyzeEsportsPerformanceInput,
): Promise<AnalyzeEsportsPerformanceOutput> {
  return analyzeEsportsPerformanceFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "analyzeEsportsPerformancePrompt_Backend",
  input: { schema: AnalyzeEsportsPerformanceInputSchema },
  output: { schema: AnalyzeEsportsPerformanceOutputSchema },
  prompt: `You are an expert esports analyst and coach. Analyze the provided player statistics and match history to identify key strengths, weaknesses, and provide actionable recommendations for improvement. Respond in Russian.

Player Statistics:
{{{playerStats}}}

Recent Match History:
{{{matchHistory}}}

Please provide a concise analysis, focusing on clear, actionable feedback. Identify specific areas of gameplay that need work, such as positioning, aim, game sense, or ability usage.
`,
});

const analyzeEsportsPerformanceFlow_Backend = ai.defineFlow(
  {
    name: "analyzeEsportsPerformanceFlow_Backend",
    inputSchema: AnalyzeEsportsPerformanceInputSchema,
    outputSchema: AnalyzeEsportsPerformanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
