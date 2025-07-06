import { z } from "zod";

export const AnalyzeEsportsPerformanceInputSchema = z.object({
  playerStats: z
    .string()
    .describe(
      "A summary of the player's key statistics (e.g., KDA, win rate, favorite map).",
    ),
  matchHistory: z.string().describe("A summary of recent match results."),
});
export type AnalyzeEsportsPerformanceInput = z.infer<
  typeof AnalyzeEsportsPerformanceInputSchema
>;

export const AnalyzeEsportsPerformanceOutputSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("A list of the player's key in-game strengths."),
  weaknesses: z
    .array(z.string())
    .describe("A list of the player's key in-game weaknesses."),
  recommendations: z
    .array(z.string())
    .describe(
      "A list of actionable recommendations for the player to improve their gameplay.",
    ),
});
export type AnalyzeEsportsPerformanceOutput = z.infer<
  typeof AnalyzeEsportsPerformanceOutputSchema
>;
