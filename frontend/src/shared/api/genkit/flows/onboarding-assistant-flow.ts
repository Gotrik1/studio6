'use server';

import type { OnboardingInput, OnboardingOutput } from './schemas/onboarding-assistant-schema';
export type { OnboardingInput, OnboardingOutput };

export async function getOnboardingSuggestions(input: OnboardingInput): Promise<OnboardingOutput> {
  const response = await fetch('/api/ai/onboarding-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
