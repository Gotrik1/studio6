'use server';

import type { z } from 'zod';
import type { AnalyzeContentInputSchema, AnalyzeContentOutputSchema } from './schemas/analyze-content-generation-schema';

export type AnalyzeContentInput = z.infer<typeof AnalyzeContentInputSchema>;
export type AnalyzeContentOutput = z.infer<typeof AnalyzeContentOutputSchema>;

export async function analyzeContent(input: AnalyzeContentInput): Promise<AnalyzeContentOutput> {
  const response = await fetch('/api/ai/analyze-content', {
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
