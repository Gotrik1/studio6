'use server';

/**
 * @fileOverview An AI agent for predicting the outcome of a match.
 *
 * - predictMatchOutcome - A function that handles the prediction.
 * - PredictMatchOutcomeInput - The input type for the function.
 * - PredictMatchOutcomeOutput - The return type for the function.
 */

import {ai} from '@genkit-ai/next';
import { PredictMatchOutcomeInputSchema, PredictMatchOutcomeOutputSchema } from './schemas/predict-match-outcome-schema';
import type { PredictMatchOutcomeInput, PredictMatchOutcomeOutput } from './schemas/predict-match-outcome-schema';

export type { PredictMatchOutcomeInput, PredictMatchOutcomeOutput };

export async function predictMatchOutcome(input: PredictMatchOutcomeInput): Promise<PredictMatchOutcomeOutput> {
  return predictMatchOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMatchOutcomePrompt',
  input: {schema: PredictMatchOutcomeInputSchema},
  output: {schema: PredictMatchOutcomeOutputSchema},
  prompt: `You are an expert sports analyst with a deep understanding of statistics and team dynamics.
Your task is to predict the winner of an upcoming match based on the provided data.

Analyze the following information:
- Match Context: {{{matchContext}}}
- Team 1: {{{team1.name}}} (Win Rate: {{{team1.winRate}}}, Recent Form: {{{team1.recentForm}}})
- Team 2: {{{team2.name}}} (Win Rate: {{{team2.winRate}}}, Recent Form: {{{team2.recentForm}}})
{{#if headToHead}}- Head-to-Head History: {{{headToHead}}}{{/if}}

Based on your analysis, predict the winner, state your confidence level (high, medium, or low), and provide a concise reasoning for your choice. Consider all factors like recent form, overall win rate, and historical performance.
`,
});

const predictMatchOutcomeFlow = ai.defineFlow(
  {
    name: 'predictMatchOutcomeFlow',
    inputSchema: PredictMatchOutcomeInputSchema,
    outputSchema: PredictMatchOutcomeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
