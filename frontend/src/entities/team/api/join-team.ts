"use server";

import { getSession } from "@/features/auth/session";
import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "@/shared/lib/api-client";

export async function joinTeamAction(teamId: string, teamSlug: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await fetchWithAuth(`/teams/${teamId}/join`, {
    method: "POST",
    body: JSON.stringify({ userId: session.user.id }),
  });

  if (result.success) {
    revalidatePath(`/teams/${teamSlug}`);
  }

  return result;
}
