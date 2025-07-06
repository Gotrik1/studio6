import { z } from "zod";

export const AiTeamAssistantInputSchema = z.object({
  teamId: z.string().describe("The ID of the team to analyze."),
});
export type AiTeamAssistantInput = z.infer<typeof AiTeamAssistantInputSchema>;

export const AiTeamAssistantOutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the recent team activity."),
  suggestions: z
    .array(z.string())
    .describe("An array of 2-3 actionable suggestions for the team captain."),
});
export type AiTeamAssistantOutput = z.infer<typeof AiTeamAssistantOutputSchema>;
