"use server";

import type { Coach } from "@/entities/coach/model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";

export async function getCoaches(): Promise<Coach[]> {
  const result = await fetchWithAuth<Coach[]>("/coaches");
  if (!result.success || !result.data) {
    console.error("Failed to fetch coaches:", result.error);
    return [];
  }
  return result.data;
}
