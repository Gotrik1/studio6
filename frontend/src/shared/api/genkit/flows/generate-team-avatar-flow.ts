'use server';

import type { GenerateTeamAvatarInput, GenerateTeamAvatarOutput } from './schemas/generate-team-avatar-schema';

export async function generateTeamAvatar(input: GenerateTeamAvatarInput): Promise<GenerateTeamAvatarOutput> {
  const response = await fetch('/api/ai/generate-team-avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
