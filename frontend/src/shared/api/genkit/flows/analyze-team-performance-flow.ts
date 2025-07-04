'use server';

/**
 * @fileOverview An API client for analyzing team performance via the backend.
 *
 * - analyzeTeamPerformance - A function that calls the backend to handle the analysis.
 * - AnalyzeTeamPerformanceInput - The input type for the function.
 * - AnalyzeTeamPerformanceOutput - The return type for the function.
 */
import type { AnalyzeTeamPerformanceInput, AnalyzeTeamPerformanceOutput } from './schemas/analyze-team-performance-schema';
export type { AnalyzeTeamPerformanceInput, AnalyzeTeamPerformanceOutput };

export async function analyzeTeamPerformance(input: AnalyzeTeamPerformanceInput): Promise<AnalyzeTeamPerformanceOutput> {
  const response = await fetch(`/api/ai/analyze-team-performance`, {
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
