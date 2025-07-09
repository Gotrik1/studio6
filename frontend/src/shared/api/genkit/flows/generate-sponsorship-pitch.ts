"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

// Define types locally to decouple from backend schemas.
export type GenerateSponsorshipPitchInput = {
  teamName: string;
  achievements: string;
  goals: string;
  audience: string;
};

export type GenerateSponsorshipPitchOutput = {
  pitch: string;
};

export async function generateSponsorshipPitch(
  input: GenerateSponsorshipPitchInput,
): Promise<GenerateSponsorshipPitchOutput> {
  const result = await fetchWithAuth<GenerateSponsorshipPitchOutput>(
    "/ai/generate-sponsorship-pitch",
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
