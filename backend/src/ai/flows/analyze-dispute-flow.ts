"use server";

/**
 * @fileOverview An AI agent for analyzing disputed matches and suggesting resolutions.
 *
 * - analyzeDispute - A function that handles the dispute analysis process.
 * - AnalyzeDisputeInput - The input type for the function.
 * - AnalyzeDisputeOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  AnalyzeDisputeInputSchema,
  AnalyzeDisputeOutputSchema,
} from "./schemas/analyze-dispute-schema";
import type {
  AnalyzeDisputeInput,
  AnalyzeDisputeOutput,
} from "./schemas/analyze-dispute-schema";

export type { AnalyzeDisputeInput, AnalyzeDisputeOutput };

export async function analyzeDispute(
  input: AnalyzeDisputeInput,
): Promise<AnalyzeDisputeOutput> {
  return analyzeDisputeFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "analyzeDisputePrompt_Backend",
  input: { schema: AnalyzeDisputeInputSchema },
  output: { schema: AnalyzeDisputeOutputSchema },
  prompt: `You are an expert, impartial sports arbiter. Your task is to analyze a disputed match and recommend a fair resolution.

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

const analyzeDisputeFlow_Backend = ai.defineFlow(
  {
    name: "analyzeDisputeFlow_Backend",
    inputSchema: AnalyzeDisputeInputSchema,
    outputSchema: AnalyzeDisputeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
