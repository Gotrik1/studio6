'use server';

import type { SummarizePlaygroundReviewsInput, SummarizePlaygroundReviewsOutput } from './schemas/summarize-playground-reviews-schema';
export type { SummarizePlaygroundReviewsInput, SummarizePlaygroundReviewsOutput };

export async function summarizePlaygroundReviews(input: SummarizePlaygroundReviewsInput): Promise<SummarizePlaygroundReviewsOutput> {
  const response = await fetch('/api/ai/summarize-playground-reviews', {
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

  return response.json();
}
