"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidatePath } from "next/cache";

type PrismaMatch = {
  id: string;
  tournamentId: string | null;
  [key: string]: any;
};

type ResolveDisputePayload = {
  winnerId: string;
  resolution: string;
  score1: number;
  score2: number;
};

export async function resolveDispute(
  matchId: string,
  payload: ResolveDisputePayload,
) {
  const result = await fetchWithAuth<PrismaMatch>(
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
