import { z } from "zod";

export const AnalyzePlayerPerformanceInputSchema = z.object({
  trainingSummary: z
    .string()
    .describe(
      "A summary of the user's key training metrics (e.g., total volume, workout streak, favorite exercise).",
    ),
  recentWorkouts: z
    .string()
    .describe(
      "A log of the user's recent workouts, including exercises, sets, reps, and weight.",
    ),
});
export type AnalyzePlayerPerformanceInput = z.infer<
  typeof AnalyzePlayerPerformanceInputSchema
>;

export const AnalyzePlayerPerformanceOutputSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("A list of the player's key strengths identified from the data."),
  weaknesses: z
    .array(z.string())
    .describe(
      "A list of the player's key weaknesses identified from the data.",
    ),
});
export type AnalyzePlayerPerformanceOutput = z.infer<
  typeof AnalyzePlayerPerformanceOutputSchema
>;
