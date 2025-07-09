"use server";

// Define types locally
export type AnalyzeDisputeInput = {
  team1Name: string;
  team2Name: string;
  disputeReason: string;
  team1Evidence: string;
  team2Evidence: string;
};

export type AnalyzeDisputeOutput = {
  recommendation: string;
  confidence: "high" | "medium" | "low";
  reasoning: string;
};

export async function analyzeDispute(
  input: AnalyzeDisputeInput,
): Promise<AnalyzeDisputeOutput> {
  const response = await fetch("/api/ai/analyze-dispute", {
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
