"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type ReviewSummary = {
  pros: string[];
  cons: string[];
  averageRating: number;
};

export async function getPlaygroundReviewSummary(
  playgroundId: string,
): Promise<ReviewSummary | null> {
  const result = await fetchWithAuth<ReviewSummary>(
    `/playgrounds/${playgroundId}/review-summary`,
  );
  if (result.success) {
    return result.data;
  }
  console.error(
    `Failed to fetch review summary for playground ${playgroundId}:`,
    result.error,
  );
  return null;
}
