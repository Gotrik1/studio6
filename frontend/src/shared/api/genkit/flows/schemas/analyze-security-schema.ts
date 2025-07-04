import { z } from 'zod';

export const AnalyzeSecurityInputSchema = z.object({
  activityLog: z
    .string()
    .describe('A log of recent user activity, including logins, matches played, and chat messages.'),
});
export type AnalyzeSecurityInput = z.infer<typeof AnalyzeSecurityInputSchema>;

const RecommendationSchema = z.object({
  title: z.string().describe('A short, clear title for the security recommendation.'),
  description: z.string().describe('A detailed description of the potential security issue and what the user can do.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the potential issue.'),
});

export const AnalyzeSecurityOutputSchema = z.object({
  recommendations: z
    .array(RecommendationSchema)
    .describe('A list of security recommendations based on the activity log.'),
});
export type AnalyzeSecurityOutput = z.infer<typeof AnalyzeSecurityOutputSchema>;
