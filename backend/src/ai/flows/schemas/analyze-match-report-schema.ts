import { z } from 'zod';

const PlayerSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  avatarHint: z.string().optional(),
});

const EventSchema = z.object({
    time: z.string(),
    event: z.string(),
    player: z.string(),
    team: z.string(),
});

export const AnalyzeMatchReportInputSchema = z.object({
  team1Name: z.string(),
  team2Name: z.string(),
  score: z.string(),
  tournament: z.string(),
  events: z.array(EventSchema),
  lineupTeam1: z.array(PlayerSchema),
  lineupTeam2: z.array(PlayerSchema),
});
export type AnalyzeMatchReportInput = z.infer<typeof AnalyzeMatchReportInputSchema>;

export const AnalyzeMatchReportOutputSchema = z.object({
  summary: z.string().describe("A 1-2 paragraph narrative summary of the match, describing the flow of the game."),
  keyMoment: z.string().describe("A description of the single most important moment or turning point of the match."),
  mvp: z.object({
    name: z.string().describe("The name of the Most Valuable Player of the match. This should be a player from the winning team."),
    reason: z.string().describe("A brief justification for why this player was chosen as the MVP.")
  }),
  team1Advice: z.string().describe("A piece of constructive advice for team 1 for their next game."),
  team2Advice: z.string().describe("A piece of constructive advice for team 2 for their next game."),
});
export type AnalyzeMatchReportOutput = z.infer<typeof AnalyzeMatchReportOutputSchema>;
