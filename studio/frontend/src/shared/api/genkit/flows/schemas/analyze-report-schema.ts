import { z } from 'zod';

export const AnalyzeReportInputSchema = z.object({
  reportReason: z.string().describe("The reason for the report as stated by the reporting user."),
  evidenceContext: z.string().describe("The context or evidence provided, such as chat logs or a description of events."),
  reportedUserActivity: z.string().describe("A summary of the reported user's recent activity and history on the platform."),
});
export type AnalyzeReportInput = z.infer<typeof AnalyzeReportInputSchema>;

export const AnalyzeReportOutputSchema = z.object({
  recommendation: z.enum(['warning', 'temp_ban', 'perm_ban', 'no_action']).describe("The AI's recommended action: 'warning' (предупреждение), 'temp_ban' (временный бан), 'perm_ban' (постоянный бан), or 'no_action' (нет нарушений)."),
  reasoning: z.string().describe("A brief explanation for the recommendation, highlighting the key factors from the evidence and user's history."),
  confidence: z.enum(['high', 'medium', 'low']).describe("The AI's confidence in its recommendation."),
});
export type AnalyzeReportOutput = z.infer<typeof AnalyzeReportOutputSchema>;
