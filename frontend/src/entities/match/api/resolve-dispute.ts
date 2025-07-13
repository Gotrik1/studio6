"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidatePath } from "next/cache";
import type { Match } from "@/entities/match/model/types";

type ResolveDisputePayload = {
  winnerId: string;
  resolution: string;
  score1: number;
  score2: number;
};

type ResolvedMatchResponse = Match & {
  tournamentId?: string;
};

export async function resolveDispute(
  matchId: string,
  payload: ResolveDisputePayload,
) {
  const result = await fetchWithAuth<ResolvedMatchResponse>(
    `/matches/${matchId}/resolve`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  if (result.success && result.data) {
    revalidatePath("/judge-center");
    if (result.data.tournamentId) {
      revalidatePath(
        `/administration/tournament-crm/${result.data.tournamentId}`,
      );
    }
  }

  return result;
}
