"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type GenerateDashboardTipInput = {
  userName: string;
  lastActivity: string;
};

export type GenerateDashboardTipOutput = {
  tip: string;
};

export async function generateDashboardTip(): Promise<GenerateDashboardTipOutput> {
  const result = await fetchWithAuth("/ai/dashboard-tip");

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch dashboard tip");
  }

  if (!result.data) {
    throw new Error("No data received from dashboard tip endpoint");
  }

  return result.data;
}
