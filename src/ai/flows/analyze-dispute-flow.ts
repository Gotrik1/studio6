'use server';

/**
 * @fileOverview An AI agent for analyzing disputed matches and suggesting resolutions.
 *
 * - analyzeDispute - A function that handles the dispute analysis process.
 * - AnalyzeDisputeInput - The input type for the function.
 * - AnalyzeDisputeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeDisputeInputSchema = z.object({
  team1Name: z.string().describe("Name of the first team."),
  team2Name: z.string().describe("Name of the second team."),
  disputeReason: z.string().describe("The reason for the dispute as stated by one of the teams."),
  team1Evidence: z.string().describe("Evidence provided by team 1, e.g., chat logs, description of a screenshot."),
  team2Evidence: z.string().describe("Evidence provided by team 2."),
});
export type AnalyzeDisputeInput = z.infer<typeof AnalyzeDisputeInputSchema>;

export const AnalyzeDisputeOutputSchema = z.object({
  recommendation: z.string().describe("A suggested resolution for the dispute. This could be awarding victory to one team, suggesting a replay, or another action."),
  confidence: z.enum(['high', 'medium', 'low']).describe("The AI's confidence in its recommendation based on the provided evidence."),
  reasoning: z.string().describe("A brief explanation of why the AI made this recommendation."),
});
export type AnalyzeDisputeOutput = z.infer<typeof AnalyzeDisputeOutputSchema>;

export async function analyzeDispute(input: AnalyzeDisputeInput): Promise<AnalyzeDisputeOutput> {
  return analyzeDisputeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDisputePrompt',
  input: {schema: AnalyzeDisputeInputSchema},
  output: {schema: AnalyzeDisputeOutputSchema},
  prompt: `You are an expert, impartial esports arbiter. Your task is to analyze a disputed match and recommend a fair resolution.

  Analyze the following information:
  - Disputed Match: {{{team1Name}}} vs {{{team2Name}}}
  - Reason for Dispute: {{{disputeReason}}}
  - Evidence from {{{team1Name}}}: {{{team1Evidence}}}
  - Evidence from {{{team2Name}}}: {{{team2Evidence}}}

  Based on the evidence, provide a clear recommendation. Your recommendation should be one of:
  - Award victory to {{{team1Name}}}.
  - Award victory to {{{team2Name}}}.
  - Suggest a replay of the match.
  - Declare a technical forfeit for one of the teams.

  Also provide your reasoning and a confidence level (high, medium, or low) in your decision. A 'low' confidence level might be appropriate if the evidence is contradictory or insufficient.
  `,
});

const analyzeDisputeFlow = ai.defineFlow(
  {
    name: 'analyzeDisputeFlow',
    inputSchema: AnalyzeDisputeInputSchema,
    outputSchema: AnalyzeDisputeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
