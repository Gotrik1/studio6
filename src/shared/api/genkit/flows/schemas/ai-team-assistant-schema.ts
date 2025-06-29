import { z } from 'zod';

export const AiTeamAssistantInputSchema = z.object({
  teamActivity: z
    .string()
    .describe('A summary of recent team activity and discussions.'),
  teamGoals: z.string().describe('The current goals and objectives of the team.'),
  relevantContent: z
    .string()
    .optional()
    .describe('Any content that might be relevant to the team, such as documents or links.'),
});
export type AiTeamAssistantInput = z.infer<typeof AiTeamAssistantInputSchema>;

export const AiTeamAssistantOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the recent team activity.'),
  suggestions: z
    .string()
    .describe('Suggestions for relevant content or actions the team should consider.'),
});
export type AiTeamAssistantOutput = z.infer<typeof AiTeamAssistantOutputSchema>;
