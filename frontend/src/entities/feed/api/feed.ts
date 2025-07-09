"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Activity } from "../model/types";
import { revalidateTag } from "next/cache";

export type { Activity };

export async function getFeed(): Promise<Activity[]> {
  const result = await fetchWithAuth("/feed", {
    next: {
      tags: ["feed"],
    },
  });
  if (!result.success) {
    console.error("Failed to fetch feed", result.error);
    return [];
  }

  if (Array.isArray(result.data)) {
    // Adapter to convert ID to string
    return result.data.map((item: Activity) => ({
      ...item,
      id: String(item.id),
    }));
  }

  return [];
}

export async function postStatus(text: string) {
  const result = await fetchWithAuth("/activities/status", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  if (result.success) {
    revalidateTag("feed");
  }

  return result;
}
