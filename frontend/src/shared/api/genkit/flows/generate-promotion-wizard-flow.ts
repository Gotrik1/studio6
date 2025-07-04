'use server';

import type { GeneratePromotionWizardInput, GeneratePromotionWizardOutput } from './schemas/generate-promotion-wizard-schema';

export type { GeneratePromotionWizardInput, GeneratePromotionWizardOutput };

export async function generatePromotionWizard(input: GeneratePromotionWizardInput): Promise<GeneratePromotionWizardOutput> {
  const response = await fetch('/api/ai/generate-promotion-wizard', {
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
