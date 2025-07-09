"use server";

import type { SponsorshipDashboardData } from "@/entities/sponsorship/model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";

export async function getSponsorshipDashboardData(): Promise<SponsorshipDashboardData | null> {
  const result = await fetchWithAuth<SponsorshipDashboardData>(
    "/sponsorship/dashboard",
  );
  if (!result.success || !result.data) {
    console.error("Failed to fetch sponsorship data:", result.error);
    return null;
  }
  return result.data;
}
