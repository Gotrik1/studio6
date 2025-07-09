"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

// Define types locally
export type GenerateTeamAvatarInput = {
  prompt: string;
};

export type GenerateTeamAvatarOutput = {
  avatarDataUri: string;
};

export async function generateTeamAvatar(
  input: GenerateTeamAvatarInput,
): Promise<GenerateTeamAvatarOutput> {
  const result = await fetchWithAuth<GenerateTeamAvatarOutput>(
    "/ai/generate-team-avatar",
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
