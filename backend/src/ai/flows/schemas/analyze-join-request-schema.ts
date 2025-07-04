import { z } from 'zod';

export const AnalyzeJoinRequestInputSchema = z.object({
  teamNeeds: z.string().describe("A summary of the team's current needs, preferred roles, and playstyle."),
  playerProfile: z.string().describe("A summary of the applying player's profile, including their stats, preferred roles, and match history."),
});
export type AnalyzeJoinRequestInput = z.infer<typeof AnalyzeJoinRequestInputSchema>;

export const AnalyzeJoinRequestOutputSchema = z.object({
  recommendation: z.enum(['accept', 'consider', 'decline']).describe("The AI's recommendation on whether to accept the player."),
  reasoning: z.string().describe("A brief explanation for the recommendation, highlighting how the player fits or doesn't fit the team's needs."),
  confidence: z.enum(['high', 'medium', 'low']).describe("The AI's confidence in its recommendation."),
});
export type AnalyzeJoinRequestOutput = z.infer<typeof AnalyzeJoinRequestOutputSchema>;
