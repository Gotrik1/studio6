'use server';

import type { GenerateMatchPostInput, GenerateMatchPostOutput } from './schemas/generate-match-post-schema';
export type { GenerateMatchPostInput, GenerateMatchPostOutput };
import { fetchWithAuth } from '@/shared/lib/api-client';


export async function generateMatchPost(input: GenerateMatchPostInput): Promise<GenerateMatchPostOutput> {
  const result = await fetchWithAuth('/ai/generate-match-post', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!result.success) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
