'use server';

import type { AnalyzeEsportsPerformanceInput, AnalyzeEsportsPerformanceOutput } from './schemas/analyze-esports-performance-schema';
export type { AnalyzeEsportsPerformanceInput, AnalyzeEsportsPerformanceOutput };

export async function analyzeEsportsPerformance(input: AnalyzeEsportsPerformanceInput): Promise<AnalyzeEsportsPerformanceOutput> {
  const response = await fetch(`/api/ai/analyze-esports-performance`, {
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
