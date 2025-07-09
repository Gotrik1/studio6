"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type GeneratePlaygroundTacticInput = {
  playgroundType: string;
  playgroundFeatures: string[];
  teamPlaystyle: string;
};

export type GeneratePlaygroundTacticOutput = {
  tacticName: string;
  tacticDescription: string;
  keyPoints: string[];
};

export async function generatePlaygroundTactic(
  input: GeneratePlaygroundTacticInput,
): Promise<GeneratePlaygroundTacticOutput> {
  const result = await fetchWithAuth<GeneratePlaygroundTacticOutput>(
    "/ai/generate-playground-tactic",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  if (!result.success || !result.data) {
    console.error("Backend API error:", result.error);
    throw new Error(result.error || "Failed to generate tactic.");
  }

  return result.data;
}
