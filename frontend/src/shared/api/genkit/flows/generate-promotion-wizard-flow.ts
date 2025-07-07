
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

// Define types locally to decouple from backend schemas.
export type GeneratePromotionWizardInput = {
  prompt: string;
};

export type GeneratePromotionWizardOutput = {
  name: string;
  description: string;
  prize: string;
  imageDataUri: string;
  cost: string;
};

export async function generatePromotionWizard(input: GeneratePromotionWizardInput): Promise<GeneratePromotionWizardOutput> {
  const result = await fetchWithAuth<GeneratePromotionWizardOutput>('/ai/generate-promotion-wizard', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!result.success || !result.data) {
    console.error("Backend API error:", result.error);
    throw new Error(`Backend API responded with status: ${result.status}`);
  }

  return result.data;
}
