"use server";

/**
 * @fileOverview An AI agent for generating user avatars.
 *
 * - generateUserAvatar - A function that handles avatar generation.
 * - GenerateUserAvatarInput - The input type for the function.
 * - GenerateUserAvatarOutput - The return type for the function.
 */

import { ai } from "../genkit";
import {
  GenerateUserAvatarInputSchema,
  GenerateUserAvatarOutputSchema,
} from "./schemas/generate-user-avatar-schema";
import type {
  GenerateUserAvatarInput,
  GenerateUserAvatarOutput,
} from "./schemas/generate-user-avatar-schema";

export type { GenerateUserAvatarInput, GenerateUserAvatarOutput };

export async function generateUserAvatar(
  input: GenerateUserAvatarInput,
): Promise<GenerateUserAvatarOutput> {
  return generateUserAvatarFlow_Backend(input);
}

const generateUserAvatarFlow_Backend = ai.defineFlow(
  {
    name: "generateUserAvatarFlow_Backend",
    inputSchema: GenerateUserAvatarInputSchema,
    outputSchema: GenerateUserAvatarOutputSchema,
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-preview-image-generation",
      prompt: `A square user profile picture for a sports platform. The user wants an avatar of: ${prompt}. Digital art, cool, vibrant, character portrait style.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (!media?.url) {
      throw new Error("Image generation failed.");
    }

    return { avatarDataUri: media.url };
  },
);
