"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

// Define types locally
export type GenerateUserAvatarInput = {
  prompt: string;
};

export type GenerateUserAvatarOutput = {
  avatarDataUri: string;
};

export async function generateUserAvatar(
  input: GenerateUserAvatarInput,
): Promise<GenerateUserAvatarOutput> {
  const response = await fetchWithAuth<GenerateUserAvatarOutput>(
    `/ai/generate-user-avatar`,
    {
      method: "POST",
      body: JSON.stringify({ prompt: input.prompt }),
      cache: "no-store",
    },
  );

  if (!response.success || !response.data) {
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.data;
}
