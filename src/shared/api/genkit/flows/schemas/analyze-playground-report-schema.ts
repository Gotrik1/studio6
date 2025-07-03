import { z } from 'zod';

export const AnalyzePlaygroundReportInputSchema = z.object({
  playgroundName: z.string().describe('The name of the playground.'),
  issueCategory: z.string().describe('The category of the reported issue (e.g., "Broken Equipment", "Damaged Surface").'),
  userComment: z.string().describe('The user\'s comment describing the issue.'),
});
export type AnalyzePlaygroundReportInput = z.infer<typeof AnalyzePlaygroundReportInputSchema>;

export const AnalyzePlaygroundReportOutputSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']).describe('The assessed severity of the issue.'),
  summary: z.string().describe('A concise, one-sentence summary of the problem for other users.'),
  suggestedAction: z.string().describe('A suggested action for platform moderators (e.g., "Post warning", "Verify report").'),
});
export type AnalyzePlaygroundReportOutput = z.infer<typeof AnalyzePlaygroundReportOutputSchema>;
