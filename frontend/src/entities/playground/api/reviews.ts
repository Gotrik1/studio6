'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { PlaygroundReview } from '../model/types';

export async function getReviews(playgroundId: string) {
  const result = await fetchWithAuth(`/playgrounds/${playgroundId}/reviews`, {
    next: { tags: [`reviews-${playgroundId}`] }
  });
  
  if (!result.success || !Array.isArray(result.data)) {
      console.error('Failed to fetch reviews:', result.error);
      return { success: false, error: result.error, data: [] };
  }

  // Adapter to map backend data to frontend type
  const formattedData = result.data.map((review: any) => ({
      id: String(review.id),
      rating: review.rating,
      comment: review.comment,
      timestamp: review.createdAt,
      author: {
          id: String(review.author.id),
          name: review.author.name,
          avatar: review.author.avatar,
      },
  }));

  return { success: true, data: formattedData };
}

export async function createReview(playgroundId: string, data: { rating: number, comment: string }) {
  const result = await fetchWithAuth(`/playgrounds/${playgroundId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.success) {
    revalidateTag(`playground-${playgroundId}`);
  }
  return result;
}
