import { z } from 'zod';

export const GenerateDashboardTipInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  lastActivity: z
    .string()
    .describe(
      'A summary of the user\'s most recent significant activity, e.g., "Won a match 13-5" or "Completed a leg day workout, setting a new personal record on squats."'
    ),
});
export type GenerateDashboardTipInput = z.infer<
  typeof GenerateDashboardTipInputSchema
>;

export const GenerateDashboardTipOutputSchema = z.object({
  tip: z
    .string()
    .describe(
      'A short, personal, and actionable tip for the user based on their last activity.'
    ),
});
export type GenerateDashboardTipOutput = z.infer<
  typeof GenerateDashboardTipOutputSchema
>;
