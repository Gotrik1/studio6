"use server";
/**
 * @fileOverview An AI coach for analyzing team performance.
 *
 * - analyzeTeamPerformance - A function that handles the team analysis process.
 * - AnalyzeTeamPerformanceInput - The input type for the function.
 * - AnalyzeTeamPerformanceOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  AnalyzeTeamPerformanceInputSchema,
  AnalyzeTeamPerformanceOutputSchema,
} from "./schemas/analyze-team-performance-schema";
import type {
  AnalyzeTeamPerformanceInput,
  AnalyzeTeamPerformanceOutput,
} from "./schemas/analyze-team-performance-schema";

export type { AnalyzeTeamPerformanceInput, AnalyzeTeamPerformanceOutput };

export async function analyzeTeamPerformance(
  input: AnalyzeTeamPerformanceInput,
): Promise<AnalyzeTeamPerformanceOutput> {
  return analyzeTeamPerformanceFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "analyzeTeamPerformancePrompt_Backend",
  input: { schema: AnalyzeTeamPerformanceInputSchema },
  output: { schema: AnalyzeTeamPerformanceOutputSchema },
  prompt: `You are an expert esports analyst and coach. Your task is to provide a deep analysis of the team "{{teamName}}".

Analyze the provided data:
- Recent Matches: {{{recentMatches}}}
- Player Stats:
{{#each playerStats}}
- {{name}}: KDA {{kda}}, Win Rate {{winRate}}, Trend: {{recentPerformanceTrend}}
{{/each}}

Based on this, identify:
1.  **Team Strengths**: What is the team doing well collectively?
2.  **Team Weaknesses**: What are the key areas for improvement?
3.  **Player in Focus**: Identify one player who stands out, either for excellent performance or for a noticeable slump. Provide a reason and a specific suggestion for them.
4.  **Training Focus**: Recommend a single, clear training focus for the upcoming week that addresses the most critical weakness.
`,
});

const analyzeTeamPerformanceFlow_Backend = ai.defineFlow(
  {
    name: "analyzeTeamPerformanceFlow_Backend",
    inputSchema: AnalyzeTeamPerformanceInputSchema,
    outputSchema: AnalyzeTeamPerformanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
