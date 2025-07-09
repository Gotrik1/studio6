"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type GeneratePromotionDetailsInput = {
  prompt: string;
};

export type GeneratePromotionDetailsOutput = {
  name: string;
  description: string;
  prize: string;
};

export async function generatePromotionDetails(
  input: GeneratePromotionDetailsInput,
): Promise<GeneratePromotionDetailsOutput> {
  const result = await fetchWithAuth<GeneratePromotionDetailsOutput>(
    "/ai/generate-promotion-details",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  if (!result.success || !result.data) {
    console.error("Backend API error:", result.error);
    throw new Error(
      result.error || `Backend API responded with status: ${result.status}`,
    );
  }

  return result.data;
}
