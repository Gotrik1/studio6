import { z } from 'zod';

const PlayerStatSchema = z.object({
  name: z.string(),
  kda: z.string(),
  winRate: z.string(),
  recentPerformanceTrend: z.enum(['up', 'down', 'stable']),
});

export const AnalyzeTeamPerformanceInputSchema = z.object({
  teamName: z.string(),
  recentMatches: z.string().describe("A summary of recent match results, e.g., 'W 13-5 vs Team A, L 10-13 vs Team B'"),
  playerStats: z.array(PlayerStatSchema),
});
export type AnalyzeTeamPerformanceInput = z.infer<typeof AnalyzeTeamPerformanceInputSchema>;

export const AnalyzeTeamPerformanceOutputSchema = z.object({
  teamStrengths: z.array(z.string()).describe("A list of 2-3 key strengths of the team."),
  teamWeaknesses: z.array(z.string()).describe("A list of 2-3 key weaknesses of the team."),
  playerInFocus: z.object({
    name: z.string(),
    reason: z.string().describe("Why this player is in focus (e.g., exceptional performance or a recent slump)."),
    suggestion: z.string().describe("A concrete suggestion for this player."),
  }),
  trainingFocus: z.string().describe("A recommended focus for the team's next week of training."),
});
export type AnalyzeTeamPerformanceOutput = z.infer<typeof AnalyzeTeamPerformanceOutputSchema>;
