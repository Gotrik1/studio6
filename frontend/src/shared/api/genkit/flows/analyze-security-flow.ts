"use server";

// Define types locally to decouple from backend schemas.
export type AnalyzeSecurityInput = {
  activityLog: string;
};

export type SecurityRecommendation = {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
};

export type AnalyzeSecurityOutput = {
  recommendations: SecurityRecommendation[];
};

export async function analyzeSecurity(
  input: AnalyzeSecurityInput,
): Promise<AnalyzeSecurityOutput> {
  const response = await fetch("/api/ai/analyze-security", {
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
