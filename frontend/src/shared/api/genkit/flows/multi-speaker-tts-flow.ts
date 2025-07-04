'use server';

import type { z } from 'zod';
import type { MultiSpeakerTtsInputSchema, MultiSpeakerTtsOutputSchema } from './schemas/multi-speaker-tts-schema';

export type MultiSpeakerTtsInput = z.infer<typeof MultiSpeakerTtsInputSchema>;
export type MultiSpeakerTtsOutput = z.infer<typeof MultiSpeakerTtsOutputSchema>;

export async function multiSpeakerTts(input: { script: string }): Promise<MultiSpeakerTtsOutput> {
  const response = await fetch('/api/ai/multi-speaker-tts', {
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
