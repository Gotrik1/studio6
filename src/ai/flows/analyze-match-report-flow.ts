'use server';
/**
 * @fileOverview An AI agent for analyzing a completed match and generating a report.
 *
 * - analyzeMatchReport - A function that handles the analysis.
 * - AnalyzeMatchReportInput - The input type for the function.
 * - AnalyzeMatchReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
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
    name: z.string().describe("The name of the Most Valuable Player of the match."),
    reason: z.string().describe("A brief justification for why this player was chosen as the MVP.")
  }),
  team1Advice: z.string().describe("A piece of constructive advice for team 1 for their next game."),
  team2Advice: z.string().describe("A piece of constructive advice for team 2 for their next game."),
});
export type AnalyzeMatchReportOutput = z.infer<typeof AnalyzeMatchReportOutputSchema>;

export async function analyzeMatchReport(input: AnalyzeMatchReportInput): Promise<AnalyzeMatchReportOutput> {
  return analyzeMatchReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMatchReportPrompt',
  input: { schema: AnalyzeMatchReportInputSchema },
  output: { schema: AnalyzeMatchReportOutputSchema },
  prompt: `You are an expert esports analyst and commentator. Your task is to provide a detailed post-match analysis for a game in the "{{{tournament}}}" tournament.

  Match Details:
  - Teams: {{{team1Name}}} vs {{{team2Name}}}
  - Final Score: {{{score}}}

  Key Events:
  {{#each events}}
  - {{time}}: {{event}} by {{player}} ({{team}})
  {{/each}}

  Team 1 Lineup:
  {{#each lineupTeam1}}
  - {{name}} ({{role}})
  {{/each}}
  
  Team 2 Lineup:
  {{#each lineupTeam2}}
  - {{name}} ({{role}})
  {{/each}}

  Based on this information, please provide a comprehensive analysis. I need you to:
  1. Write a narrative summary of the match. How did the game unfold? Was it a close match or a dominant performance?
  2. Identify the single key moment or turning point of the match. What happened that changed the course of the game?
  3. Choose a Most Valuable Player (MVP) from either team and briefly explain your choice. Look for outstanding performance or a critical play.
  4. Provide one piece of constructive advice for each team to consider for their next game. What could {{{team1Name}}} and {{{team2Name}}} improve?
  `,
});

const analyzeMatchReportFlow = ai.defineFlow(
  {
    name: 'analyzeMatchReportFlow',
    inputSchema: AnalyzeMatchReportInputSchema,
    outputSchema: AnalyzeMatchReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
