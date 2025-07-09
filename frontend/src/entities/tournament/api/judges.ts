"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidateTag } from "next/cache";
import { User, UserStatus } from "@/shared/lib/types";

const mapBackendJudgeToFrontendUser = (backendJudge: User): User => {
  return {
    ...backendJudge,
    id: String(backendJudge.id), // Ensure ID is a string
    status: backendJudge.status || UserStatus.ACTIVE,
  };
};

export async function getAssignedJudges(tournamentId: string): Promise<User[]> {
  const result = await fetchWithAuth<User[]>(
    `/tournaments/${tournamentId}/judges`,
  );
  if (result.success && Array.isArray(result.data)) {
    return result.data.map(mapBackendJudgeToFrontendUser);
  }
  return [];
}

export async function getAvailableJudges(): Promise<User[]> {
  const result = await fetchWithAuth<User[]>("/users?role=JUDGE");
  // Assuming /users endpoint already returns the correct User shape, but we can map just in case.
  if (result.success && Array.isArray(result.data)) {
    return result.data.map(mapBackendJudgeToFrontendUser);
  }
  return [];
}

export async function assignJudge(tournamentId: string, judgeId: string) {
  const result = await fetchWithAuth(`/tournaments/${tournamentId}/judges`, {
    method: "POST",
    body: JSON.stringify({ judgeId }),
  });
  if (result.success) {
    revalidateTag(`judges-${tournamentId}`);
  }
  return result;
}

export async function unassignJudge(tournamentId: string, judgeId: string) {
  const result = await fetchWithAuth(
    `/tournaments/${tournamentId}/judges/${judgeId}`,
    {
      method: "DELETE",
    },
  );
  if (result.success) {
    revalidateTag(`judges-${tournamentId}`);
  }
  return result;
}
