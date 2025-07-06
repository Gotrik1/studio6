import { z } from "zod";

const TeamStatsSchema = z.object({
  name: z.string(),
  winRate: z.string(),
  recentForm: z
    .string()
    .describe("Summary of recent match results, e.g., 'WWLWL'"),
});

export const PredictMatchOutcomeInputSchema = z.object({
  team1: TeamStatsSchema,
  team2: TeamStatsSchema,
  headToHead: z
    .string()
    .optional()
    .describe("Summary of past matches between these two teams."),
  matchContext: z
    .string()
    .optional()
    .describe(
      "Context of the match, e.g., 'Final of a major tournament', 'Regular season match'.",
    ),
});
export type PredictMatchOutcomeInput = z.infer<
  typeof PredictMatchOutcomeInputSchema
>;

export const PredictMatchOutcomeOutputSchema = z.object({
  predictedWinner: z
    .string()
    .describe("The name of the team predicted to win."),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("The AI's confidence in its prediction."),
  reasoning: z
    .string()
    .describe(
      "A brief analysis explaining the prediction, mentioning key factors.",
    ),
});
export type PredictMatchOutcomeOutput = z.infer<
  typeof PredictMatchOutcomeOutputSchema
>;
