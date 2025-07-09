"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidateTag } from "next/cache";

export type CreatePracticeData = {
  title: string;
  description?: string;
  date: Date;
  playgroundId: string;
};

export async function getTeamPractices(teamId: string) {
  const result = await fetchWithAuth(`/teams/${teamId}/practices`, {
    next: { tags: [`team-practices-${teamId}`] },
  });
  return result;
}

export async function createTeamPractice(
  teamId: string,
  data: CreatePracticeData,
) {
  const result = await fetchWithAuth(`/teams/${teamId}/practices`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.success) {
    revalidateTag(`team-practices-${teamId}`);
  }

  return result;
}
