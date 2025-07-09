"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type CreateMediaData = {
  type: "IMAGE" | "VIDEO" | "AUDIO";
  src: string;
  description?: string;
  hint?: string;
};

export async function createTournamentMedia(
  tournamentId: string,
  data: CreateMediaData,
) {
  return fetchWithAuth(`/tournaments/${tournamentId}/media`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
