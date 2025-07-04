'use server';

import type { AnalyzePlaygroundReportInput, AnalyzePlaygroundReportOutput } from './schemas/analyze-playground-report-schema';

export type { AnalyzePlaygroundReportInput, AnalyzePlaygroundReportOutput };

export async function analyzePlaygroundReport(input: AnalyzePlaygroundReportInput): Promise<AnalyzePlaygroundReportOutput> {
  const response = await fetch('/api/ai/analyze-playground-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Backend API error:', errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
