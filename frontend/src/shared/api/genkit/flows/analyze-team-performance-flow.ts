"use server";

// Types are defined locally to decouple from backend schemas.
export type AnalyzeTeamPerformanceInput = {
  teamName: string;
  recentMatches: string;
  playerStats: {
    name: string;
    kda: string;
    winRate: string;
    recentPerformanceTrend: "up" | "down" | "stable";
  }[];
};

export type AnalyzeTeamPerformanceOutput = {
  teamStrengths: string[];
  teamWeaknesses: string[];
  playerInFocus: {
    name: string;
    reason: string;
    suggestion: string;
  };
  trainingFocus: string;
};

export async function analyzeTeamPerformance(
  input: AnalyzeTeamPerformanceInput,
): Promise<AnalyzeTeamPerformanceOutput> {
  const response = await fetch(`/api/ai/analyze-team-performance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
