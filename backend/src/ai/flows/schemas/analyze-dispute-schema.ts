import { z } from "zod";

export const AnalyzeDisputeInputSchema = z.object({
  team1Name: z.string().describe("Name of the first team."),
  team2Name: z.string().describe("Name of the second team."),
  disputeReason: z
    .string()
    .describe("The reason for the dispute as stated by one of the teams."),
  team1Evidence: z
    .string()
    .describe(
      "Evidence provided by team 1, e.g., chat logs, description of a screenshot.",
    ),
  team2Evidence: z.string().describe("Evidence provided by team 2."),
});
export type AnalyzeDisputeInput = z.infer<typeof AnalyzeDisputeInputSchema>;

export const AnalyzeDisputeOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      "A suggested resolution for the dispute. This could be awarding victory to one team, suggesting a replay, or another action.",
    ),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe(
      "The AI's confidence in its recommendation based on the provided evidence.",
    ),
  reasoning: z
    .string()
    .describe("A brief explanation of why the AI made this recommendation."),
});
export type AnalyzeDisputeOutput = z.infer<typeof AnalyzeDisputeOutputSchema>;
