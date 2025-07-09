"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { MatchEvent } from "@/entities/match/model/types";

export type GenerateMatchCommentaryInput = {
  team1Name: string;
  team2Name: string;
  events: MatchEvent[];
};

export type GenerateMatchCommentaryOutput = {
  commentaryScript: string;
  audioDataUri: string;
};

export async function generateMatchCommentary(
  input: GenerateMatchCommentaryInput,
): Promise<GenerateMatchCommentaryOutput> {
  const result = await fetchWithAuth<GenerateMatchCommentaryOutput>(
    "/ai/generate-match-commentary",
    {
      method: "POST",
      body: JSON.stringify(input),
      cache: "no-store",
    },
  );

  if (!result.success || !result.data) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
