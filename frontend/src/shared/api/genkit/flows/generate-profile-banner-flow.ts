'use server';

/**
 * @fileOverview An API client for generating user profile banners via the backend.
 *
 * - generateProfileBanner - A function that calls the backend to handle banner generation.
 * - GenerateProfileBannerInput - The input type for the function.
 * - GenerateProfileBannerOutput - The return type for the function.
 */

import {
  GenerateProfileBannerInputSchema,
  GenerateProfileBannerOutputSchema,
} from './schemas/generate-profile-banner-schema';
import type {
  GenerateProfileBannerInput,
  GenerateProfileBannerOutput,
} from './schemas/generate-profile-banner-schema';

export type { GenerateProfileBannerInput, GenerateProfileBannerOutput };

export async function generateProfileBanner(
  input: GenerateProfileBannerInput
): Promise<GenerateProfileBannerOutput> {
  const parsedInput = GenerateProfileBannerInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for generating profile banner.');
  }

  const response = await fetch('/api/ai/generate-profile-banner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: parsedInput.data.prompt }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();

  const parsedOutput = GenerateProfileBannerOutputSchema.safeParse(result);
  if (!parsedOutput.success) {
      console.error("Invalid response from backend:", parsedOutput.error);
      throw new Error("Received invalid data structure from backend.");
  }
  
  return parsedOutput.data;
}
