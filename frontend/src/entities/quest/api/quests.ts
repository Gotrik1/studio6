"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Quest } from "../model/types";
import { revalidateTag } from "next/cache";

export type { Quest };
type CreateQuestData = Omit<Quest, "id" | "progress">;

export async function getQuests(): Promise<Quest[]> {
  const result = await fetchWithAuth<Quest[]>("/quests", {
    next: { tags: ["quests"] },
  });
  if (result.success && Array.isArray(result.data)) {
    // Here we add a mock progress for demonstration on the frontend.
    // In a real app, progress would come from a user-specific endpoint.
    return result.data.map((q: Quest) => ({
      ...q,
      progress: Math.floor(Math.random() * q.goal),
    }));
  }
  if (!result.success) {
    console.error("Failed to fetch quests:", result.error);
  }
  return [];
}

export async function createQuest(data: CreateQuestData) {
  const result = await fetchWithAuth("/quests", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (result.success) {
    revalidateTag("quests");
  }
  return result;
}

export async function deleteQuest(id: string) {
  const result = await fetchWithAuth(`/quests/${id}`, {
    method: "DELETE",
  });

  if (result.success) {
    revalidateTag("quests");
  }
  return result;
}
