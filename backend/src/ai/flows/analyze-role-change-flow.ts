"use server";

/**
 * @fileOverview An AI agent for analyzing a user's request for a role change.
 *
 * - analyzeRoleChange - A function that handles the analysis.
 * - AnalyzeRoleChangeInput - The input type for the function.
 * - AnalyzeRoleChangeOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  AnalyzeRoleChangeInputSchema,
  AnalyzeRoleChangeOutputSchema,
} from "./schemas/analyze-role-change-schema";
import type {
  AnalyzeRoleChangeInput,
  AnalyzeRoleChangeOutput,
} from "./schemas/analyze-role-change-schema";

export type { AnalyzeRoleChangeInput, AnalyzeRoleChangeOutput };

export async function analyzeRoleChange(
  input: AnalyzeRoleChangeInput,
): Promise<AnalyzeRoleChangeOutput> {
  return analyzeRoleChangeFlow_Backend(input);
}

const prompt = ai.definePrompt({
  name: "analyzeRoleChangePrompt_Backend",
  input: { schema: AnalyzeRoleChangeInputSchema },
  output: { schema: AnalyzeRoleChangeOutputSchema },
  prompt: `You are an experienced administrator of a sports platform. Your task is to evaluate a user for a promotion to a position of responsibility.

  Analyze the user's activity summary to determine if they are a good fit for the requested role.
  - For 'Модератор' or 'Судья', look for signs of fairness, impartiality, good communication, and knowledge of the rules.
  - Red flags include toxicity, abuse of systems, frequent complaints, or suspicious activity.

  User: {{{userName}}}
  Current Role: {{{currentRole}}}
  Requested Role: {{{requestedRole}}}
  Activity Summary:
  {{{activitySummary}}}

  Provide a clear recommendation ('approve', 'deny', or 'caution'), your reasoning, and a confidence level.
  `,
});

const analyzeRoleChangeFlow_Backend = ai.defineFlow(
  {
    name: "analyzeRoleChangeFlow_Backend",
    inputSchema: AnalyzeRoleChangeInputSchema,
    outputSchema: AnalyzeRoleChangeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
