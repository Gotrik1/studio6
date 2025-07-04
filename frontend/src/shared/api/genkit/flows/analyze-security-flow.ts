'use server';

import type { z } from 'zod';
import type { AnalyzeSecurityInputSchema, AnalyzeSecurityOutputSchema } from './schemas/analyze-security-schema';

export type AnalyzeSecurityInput = z.infer<typeof AnalyzeSecurityInputSchema>;
export type AnalyzeSecurityOutput = z.infer<typeof AnalyzeSecurityOutputSchema>;

export async function analyzeSecurity(input: AnalyzeSecurityInput): Promise<AnalyzeSecurityOutput> {
  const response = await fetch('/api/ai/analyze-security', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
