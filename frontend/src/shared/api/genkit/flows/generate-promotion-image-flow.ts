'use server';

import type { GeneratePromotionImageInput, GeneratePromotionImageOutput } from './schemas/generate-promotion-image-schema';

export async function generatePromotionImage(prompt: GeneratePromotionImageInput): Promise<GeneratePromotionImageOutput> {
  const response = await fetch('/api/ai/generate-promotion-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
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
