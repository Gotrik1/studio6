'use server';

/**
 * @fileOverview An API client for analyzing a player's request to join a team via the backend.
 *
 * - analyzeJoinRequest - A function that calls the backend to handle the analysis.
 * - AnalyzeJoinRequestInput - The input type for the function.
 * - AnalyzeJoinRequestOutput - The return type for the function.
 */

// Define types here to decouple from backend Zod schemas
export type AnalyzeJoinRequestInput = {
  teamNeeds: string;
  playerProfile: string;
};

export type AnalyzeJoinRequestOutput = {
  recommendation: 'accept' | 'consider' | 'decline';
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
};


export async function analyzeJoinRequest(input: AnalyzeJoinRequestInput): Promise<AnalyzeJoinRequestOutput> {
  const response = await fetch(`/api/ai/analyze-join-request`, {
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
