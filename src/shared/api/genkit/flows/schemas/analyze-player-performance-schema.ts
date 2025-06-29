import { z } from 'zod';

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
