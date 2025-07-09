"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type GenerateProfileBannerInput = {
  prompt: string;
};

export type GenerateProfileBannerOutput = {
  imageDataUri: string;
};

export async function generateProfileBanner(
  input: GenerateProfileBannerInput,
): Promise<GenerateProfileBannerOutput> {
  const response = await fetchWithAuth<GenerateProfileBannerOutput>(
    "/ai/generate-profile-banner",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  if (!response.success || !response.data) {
    console.error("Backend API error:", response.error);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.data;
}
