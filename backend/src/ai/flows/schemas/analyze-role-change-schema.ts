import { z } from "zod";

export const AnalyzeRoleChangeInputSchema = z.object({
  userName: z
    .string()
    .describe("The name of the user requesting the role change."),
  currentRole: z.string().describe("The user's current role."),
  requestedRole: z
    .string()
    .describe(
      "The new role the user is being considered for (e.g., 'Модератор', 'Судья').",
    ),
  activitySummary: z
    .string()
    .describe(
      "A summary of the user's recent activity, including chat behavior, match reports, and community interactions.",
    ),
});
export type AnalyzeRoleChangeInput = z.infer<
  typeof AnalyzeRoleChangeInputSchema
>;

export const AnalyzeRoleChangeOutputSchema = z.object({
  recommendation: z
    .enum(["approve", "deny", "caution"])
    .describe(
      "The AI's recommendation: 'approve' (одобрить), 'deny' (отклонить), or 'caution' (рассмотреть с осторожностью).",
    ),
  reasoning: z
    .string()
    .describe(
      "A brief explanation for the recommendation, highlighting positive or negative indicators in the user's activity.",
    ),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("The AI's confidence in its recommendation."),
});
export type AnalyzeRoleChangeOutput = z.infer<
  typeof AnalyzeRoleChangeOutputSchema
>;
