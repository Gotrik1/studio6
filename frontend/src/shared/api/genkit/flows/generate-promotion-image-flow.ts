'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export type GeneratePromotionImageInput = string;

export type GeneratePromotionImageOutput = {
  imageDataUri: string;
};

export async function generatePromotionImage(prompt: GeneratePromotionImageInput): Promise<GeneratePromotionImageOutput> {
  const result = await fetchWithAuth('/ai/generate-promotion-image', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

  if (!result.success) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
