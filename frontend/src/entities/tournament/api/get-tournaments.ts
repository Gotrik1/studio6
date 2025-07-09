"use server";

import type { Tournament } from "@/entities/tournament/model/types";
import type { TournamentCrm } from "@/entities/user/model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";

export type { Tournament };

export async function fetchTournaments(game?: string): Promise<Tournament[]> {
  const url = game
    ? `/tournaments?game=${encodeURIComponent(game)}`
    : "/tournaments";
  const result = await fetchWithAuth<Tournament[]>(url);

  if (!result.success) {
    console.error("Failed to fetch tournaments from backend:", result.error);
    return []; // Return empty array on failure
  }

  return result.data;
}

export async function fetchCrmTournaments(): Promise<TournamentCrm[]> {
  const result = await fetchWithAuth<TournamentCrm[]>("/tournaments/crm");

  if (!result.success) {
    console.error(
      "Failed to fetch CRM tournaments from backend:",
      result.error,
    );
    return []; // Return empty array on failure
  }

  return result.data;
}
