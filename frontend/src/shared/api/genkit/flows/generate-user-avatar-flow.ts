
'use server';

/**
 * @fileOverview An API client for generating user avatars via the backend.
 *
 * - generateUserAvatar - A function that calls the backend to handle avatar generation.
 * - GenerateUserAvatarInput - The input type for the function.
 * - GenerateUserAvatarOutput - The return type for the function.
 */

import {
  GenerateUserAvatarInputSchema,
  GenerateUserAvatarOutputSchema,
} from './schemas/generate-user-avatar-schema';
import type {
  GenerateUserAvatarInput,
  GenerateUserAvatarOutput,
} from './schemas/generate-user-avatar-schema';

export type { GenerateUserAvatarInput, GenerateUserAvatarOutput };

export async function generateUserAvatar(
  input: GenerateUserAvatarInput
): Promise<GenerateUserAvatarOutput> {
  const parsedInput = GenerateUserAvatarInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for generating user avatar.');
  }

  const response = await fetch(
    `/api/ai/generate-user-avatar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: parsedInput.data.prompt }),
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();

  const parsedOutput = GenerateUserAvatarOutputSchema.safeParse(result);
  if (!parsedOutput.success) {
    console.error('Invalid response from backend:', parsedOutput.error);
    throw new Error('Received invalid data structure from backend.');
  }

  return parsedOutput.data;
}
