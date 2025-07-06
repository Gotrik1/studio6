import { z } from "zod";

export const AnalyzeHolisticPerformanceInputSchema = z.object({
  physicalSummary: z
    .string()
    .describe(
      "A summary of the player's recent physical training activity, including volume, workout types, and personal records.",
    ),
  esportsSummary: z
    .string()
    .describe(
      "A summary of the player's recent esports performance, including match results, KDA, and win rates.",
    ),
});
export type AnalyzeHolisticPerformanceInput = z.infer<
  typeof AnalyzeHolisticPerformanceInputSchema
>;

export const CorrelationSchema = z.object({
  observation: z
    .string()
    .describe(
      "The observed correlation, e.g., 'Improved KDA after strength training days'.",
    ),
  explanation: z
    .string()
    .describe("A possible explanation for this correlation."),
});

export const AnalyzeHolisticPerformanceOutputSchema = z.object({
  overallAssessment: z
    .string()
    .describe(
      "A brief, high-level assessment of the player's overall condition, combining physical and gaming aspects.",
    ),
  correlations: z
    .array(CorrelationSchema)
    .describe(
      "A list of identified correlations between physical training and esports performance.",
    ),
  recommendations: z
    .array(z.string())
    .describe(
      "Actionable recommendations for the player to improve both their physical and gaming performance.",
    ),
});
export type AnalyzeHolisticPerformanceOutput = z.infer<
  typeof AnalyzeHolisticPerformanceOutputSchema
>;
