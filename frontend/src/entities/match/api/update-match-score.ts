"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidatePath } from "next/cache";

export async function updateMatchScore(
  matchId: string,
  score1: number,
  score2: number,
  comment?: string,
) {
  const result = await fetchWithAuth(`/matches/${matchId}/score`, {
    method: "PATCH",
    body: JSON.stringify({ score1, score2, comment }),
  });
  if (result.success) {
    revalidatePath("/matches");
    revalidatePath(`/matches/${matchId}`);
  }
  return result;
}
