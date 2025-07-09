"use server";

import type { LfgLobby } from "@/entities/lfg/model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidatePath } from "next/cache";

export type CreateLobbyApiData = {
  type: "GAME" | "TRAINING";
  sport: string;
  location: string;
  playgroundId?: string;
  startTime: Date;
  duration: number;
  playersNeeded: number;
  comment: string;
};

export async function fetchLobbies(): Promise<LfgLobby[]> {
  const result = await fetchWithAuth<LfgLobby[]>("/lfg");
  if (!result.success || !result.data) {
    console.error("Failed to fetch lobbies:", result.error);
    return [];
  }
  // Prisma returns Date objects as strings, need to convert them back
  return result.data.map((lobby: LfgLobby) => ({
    ...lobby,
    startTime: new Date(lobby.startTime),
    endTime: new Date(lobby.endTime),
  }));
}

export async function createLobby(data: CreateLobbyApiData) {
  const result = await fetchWithAuth("/lfg", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (result.success) {
    revalidatePath("/lfg");
  }
  return result;
}

export async function joinLobby(lobbyId: string) {
  const result = await fetchWithAuth(`/lfg/${lobbyId}/join`, {
    method: "POST",
  });
  if (result.success) {
    revalidatePath("/lfg");
  }
  return result;
}
