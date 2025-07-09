"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type GeneratePlaygroundSummaryInput = {
  name: string;
  address: string;
  surface: string;
  features: string[];
};

export type GeneratePlaygroundSummaryOutput = {
  summary: string;
};

export async function generatePlaygroundSummary(
  input: GeneratePlaygroundSummaryInput,
): Promise<GeneratePlaygroundSummaryOutput> {
  const result = await fetchWithAuth<GeneratePlaygroundSummaryOutput>(
    "/ai/generate-playground-summary",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  if (!result.success || !result.data) {
    console.error("Backend API error:", result.error);
    throw new Error(
      `Backend API responded with status: ${result.status || 500}`,
    );
  }

  return result.data;
}
