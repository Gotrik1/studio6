'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { Poll } from '../model/types';
import { revalidateTag } from 'next/cache';

export async function getLatestPoll(): Promise<Poll | null> {
    const result = await fetchWithAuth('/polls/latest', {
        next: { tags: ['poll'] }
    });
    if (!result.success) {
        console.error("Failed to fetch latest poll:", result.error);
        return null;
    }
    return result.data;
}

export async function submitVote(pollId: string, optionId: string) {
    const result = await fetchWithAuth(`/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionId }),
    });

    if (result.success) {
        revalidateTag('poll');
    }

    return result;
}
