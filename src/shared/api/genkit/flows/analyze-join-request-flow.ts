
'use server';

/**
 * @fileOverview An AI agent for analyzing a player's request to join a team.
 *
 * - analyzeJoinRequest - A function that handles the analysis.
 * - AnalyzeJoinRequestInput - The input type for the function.
 * - AnalyzeJoinRequestOutput - The return type for the function.
 */

import {ai} from '@/shared/api/genkit';
import { AnalyzeJoinRequestInputSchema, AnalyzeJoinRequestOutputSchema } from './schemas/analyze-join-request-schema';
import type { AnalyzeJoinRequestInput, AnalyzeJoinRequestOutput } from './schemas/analyze-join-request-schema';

export type { AnalyzeJoinRequestInput, AnalyzeJoinRequestOutput };

export async function analyzeJoinRequest(input: AnalyzeJoinRequestInput): Promise<AnalyzeJoinRequestOutput> {
  return analyzeJoinRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJoinRequestPrompt',
  input: {schema: AnalyzeJoinRequestInputSchema},
  output: {schema: AnalyzeJoinRequestOutputSchema},
  prompt: `You are an expert sports team scout and analyst. Your task is to evaluate a player's request to join a team.

  Analyze the player's profile against the team's needs. Provide a clear recommendation (accept, consider, or decline), a confidence level, and your reasoning.

  Team Needs & Playstyle:
  {{{teamNeeds}}}

  Applying Player's Profile:
  {{{playerProfile}}}
  `,
});

const analyzeJoinRequestFlow = ai.defineFlow(
  {
    name: 'analyzeJoinRequestFlow',
    inputSchema: AnalyzeJoinRequestInputSchema,
    outputSchema: AnalyzeJoinRequestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
