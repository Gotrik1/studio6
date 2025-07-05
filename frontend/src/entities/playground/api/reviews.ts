'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getReviews(playgroundId: string) {
  const result = await fetchWithAuth(`/playgrounds/${playgroundId}/reviews`, {
    next: { tags: [`reviews-${playgroundId}`] }
  });
  return result;
}

export async function createReview(playgroundId: string, data: { rating: number, comment: string }) {
  const result = await fetchWithAuth(`/playgrounds/${playgroundId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.success) {
    revalidateTag(`reviews-${playgroundId}`);
  }
  return result;
}
