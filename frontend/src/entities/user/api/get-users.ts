"use server";

import type { User } from "@/shared/lib/types";
import { fetchWithAuth } from "@/shared/lib/api-client";

export async function getUsers(): Promise<User[]> {
  const result = await fetchWithAuth("/users");
  if (result.success) {
    return result.data as User[];
  }
  console.error("Failed to fetch users:", result.error);
  return [];
}
