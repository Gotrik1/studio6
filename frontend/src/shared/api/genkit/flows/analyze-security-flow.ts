'use server';

/**
 * @fileOverview An AI agent for analyzing user activity for security risks.
 *
 * - analyzeSecurity - A function that handles the security analysis process.
 * - AnalyzeSecurityInput - The input type for the analyzeSecurity function.
 * - AnalyzeSecurityOutput - The return type for the analyzeSecurity function.
 */

import {ai} from '@genkit-ai/next';
import { AnalyzeSecurityInputSchema, AnalyzeSecurityOutputSchema } from './schemas/analyze-security-schema';
import type { AnalyzeSecurityInput, AnalyzeSecurityOutput } from './schemas/analyze-security-schema';

export type { AnalyzeSecurityInput, AnalyzeSecurityOutput };

export async function analyzeSecurity(input: AnalyzeSecurityInput): Promise<AnalyzeSecurityOutput> {
  return analyzeSecurityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSecurityPrompt',
  input: {schema: AnalyzeSecurityInputSchema},
  output: {schema: AnalyzeSecurityOutputSchema},
  prompt: `You are a security expert for an esports platform. Analyze the provided activity log for any potential security risks or suspicious behavior.

  Focus on:
  - Unusual login times or locations.
  - Sudden, drastic changes in player performance (could indicate cheating or account sharing).
  - Suspicious chat messages (e.g., asking for account details, sharing phishing links).
  - High frequency of failed login attempts.

  Based on your analysis, provide a list of concrete security recommendations. If there are no issues, return an empty list or one low-severity recommendation praising the user for good security hygiene.

  Activity Log:
  {{{activityLog}}}
  `,
});

const analyzeSecurityFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityFlow',
    inputSchema: AnalyzeSecurityInputSchema,
    outputSchema: AnalyzeSecurityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
