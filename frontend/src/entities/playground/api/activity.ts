'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getPlaygroundActivity(playgroundId: string) {
    const result = await fetchWithAuth(`/activities/playground/${playgroundId}`, {
        next: { tags: [`playground-activity-${playgroundId}`] }
    });
    if (!result.success) {
        console.error(`Failed to fetch activity for playground ${playgroundId}:`, result.error);
        return [];
    }
    return result.data;
}

export async function createCheckIn(data: { playgroundId: string; comment?: string; photo?: string }) {
    const result = await fetchWithAuth('/activities/check-in', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (result.success) {
        revalidateTag(`playground-activity-${data.playgroundId}`);
    }
    return result;
}
