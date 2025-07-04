'use server';

import type { z } from 'zod';
import type { GenerateDialogueInputSchema, GenerateDialogueOutputSchema } from './schemas/dialogue-generation-schema';

export type GenerateDialogueInput = z.infer<typeof GenerateDialogueInputSchema>;
export type GenerateDialogueOutput = z.infer<typeof GenerateDialogueOutputSchema>;


export async function generateDialogue(input: {topic: string}): Promise<GenerateDialogueOutput> {
  const response = await fetch('/api/ai/generate-dialogue', {
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
