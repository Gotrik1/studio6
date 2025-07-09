"use server";
import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "@/shared/lib/api-client";

export async function createTeamAction(teamData: {
  name: string;
  motto: string;
  description: string;
  logo: string;
  dataAiHint: string;
  game: string;
  homePlaygroundId: string | null;
  captainId: string;
}) {
  const result = await fetchWithAuth("/teams", {
    method: "POST",
    body: JSON.stringify(teamData),
  });

  if (result.success) {
    revalidatePath("/teams");
  }

  return result;
}
