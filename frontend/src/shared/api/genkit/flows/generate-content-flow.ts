'use server';

import type { z } from 'zod';
import type { GenerateContentInputSchema, GenerateContentOutputSchema } from './schemas/generate-content-schema';

export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  const response = await fetch('/api/ai/generate-content', {
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
