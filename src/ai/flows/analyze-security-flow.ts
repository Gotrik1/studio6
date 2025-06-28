'use server';

/**
 * @fileOverview An AI agent for analyzing user activity for security risks.
 *
 * - analyzeSecurity - A function that handles the security analysis process.
 * - AnalyzeSecurityInput - The input type for the analyzeSecurity function.
 * - AnalyzeSecurityOutput - The return type for the analyzeSecurity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeSecurityInputSchema = z.object({
  activityLog: z
    .string()
    .describe('A log of recent user activity, including logins, matches played, and chat messages.'),
});
export type AnalyzeSecurityInput = z.infer<typeof AnalyzeSecurityInputSchema>;

const RecommendationSchema = z.object({
  title: z.string().describe('A short, clear title for the security recommendation.'),
  description: z.string().describe('A detailed description of the potential security issue and what the user can do.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the potential issue.'),
});

export const AnalyzeSecurityOutputSchema = z.object({
  recommendations: z
    .array(RecommendationSchema)
    .describe('A list of security recommendations based on the activity log.'),
});
export type AnalyzeSecurityOutput = z.infer<typeof AnalyzeSecurityOutputSchema>;

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
