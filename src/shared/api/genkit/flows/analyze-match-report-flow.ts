'use server';
/**
 * @fileOverview An AI agent for analyzing a completed match and generating a report.
 *
 * - analyzeMatchReport - A function that handles the analysis.
 * - AnalyzeMatchReportInput - The input type for the function.
 * - AnalyzeMatchReportOutput - The return type for the function.
 */

import { ai } from '@/shared/api/genkit';
import { z } from 'zod';
import { AnalyzeMatchReportInputSchema, AnalyzeMatchReportOutputSchema } from './schemas/analyze-match-report-schema';
import type { AnalyzeMatchReportInput, AnalyzeMatchReportOutput } from './schemas/analyze-match-report-schema';

export type { AnalyzeMatchReportInput, AnalyzeMatchReportOutput };

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
