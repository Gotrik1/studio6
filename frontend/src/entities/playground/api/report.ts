'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function reportPlaygroundIssue(data: { playgroundId: string; category: string; comment: string; }) {
  const result = await fetchWithAuth('/playground-reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (result.success) {
    // Revalidate the condition tag for the specific playground
    revalidateTag(`playground-condition-${data.playgroundId}`);
  }

  return result;
}
