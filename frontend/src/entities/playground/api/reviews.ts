"use server";

import { fetchWithAuth, type FetchResult } from "@/shared/lib/api-client";
import { revalidateTag } from "next/cache";
import type { PlaygroundReview as PlaygroundReviewType } from "../model/types";
export type { PlaygroundReview } from "../model/types";

export type CreateReviewData = {
  rating: number;
  comment: string;
};

type RawReviewAuthor = {
  id: string;
  name: string;
  avatar: string | null;
};

type RawReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: RawReviewAuthor;
};

export async function getReviews(
  playgroundId: string,
): Promise<FetchResult<PlaygroundReviewType[]>> {
  const result = await fetchWithAuth(`/playgrounds/${playgroundId}/reviews`, {
    next: { tags: [`reviews-${playgroundId}`] },
  });

  if (!result.success) {
    console.error("Failed to fetch reviews:", result.error);
    return {
      success: false,
      error: result.error,
      status: result.status,
      data: null,
    };
  }

  if (!Array.isArray(result.data)) {
    return {
      success: false,
      error: "Invalid data format",
      status: 500,
      data: null,
    };
  }

  // Adapter to map backend data to frontend type
  const formattedData: PlaygroundReviewType[] = result.data.map(
    (review: RawReview) => ({
      id: String(review.id),
      rating: review.rating,
      comment: review.comment,
      timestamp: review.createdAt,
      author: {
        id: String(review.author.id),
        name: review.author.name,
        avatar: review.author.avatar,
      },
    }),
  );

  return { success: true, data: formattedData, status: result.status };
}

export async function createReview(
  playgroundId: string,
  data: CreateReviewData,
) {
  const result = await fetchWithAuth(`/playgrounds/${playgroundId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (result.success) {
    revalidateTag(`playground-${playgroundId}`);
    revalidateTag(`reviews-${playgroundId}`); // Also revalidate the reviews list
  }
  return result;
}
