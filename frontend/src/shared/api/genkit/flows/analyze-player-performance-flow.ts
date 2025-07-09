"use server";

// Define types here to decouple from backend Zod schemas
export type AnalyzePlayerPerformanceInput = {
  trainingSummary: string;
  recentWorkouts: string;
};

export type AnalyzePlayerPerformanceOutput = {
  strengths: string[];
  weaknesses: string[];
};

export async function analyzePlayerPerformance(
  input: AnalyzePlayerPerformanceInput,
): Promise<AnalyzePlayerPerformanceOutput> {
  const response = await fetch("/api/ai/analyze-player-performance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
