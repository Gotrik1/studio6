'use server';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type PlaygroundConditionReport = {
    id: string;
    severity: 'low' | 'medium' | 'high';
    summary: string;
    createdAt: string;
};

export async function getPlaygroundCondition(playgroundId: string): Promise<PlaygroundConditionReport | null> {
    const result = await fetchWithAuth(`/playgrounds/${playgroundId}/condition`, {
        next: { tags: [`playground-condition-${playgroundId}`] }
    });

    if (result.success && result.data) {
        return result.data;
    }

    if (result.status !== 404) {
         console.error(`Failed to fetch playground condition for ${playgroundId}:`, result.error);
    }

    return null;
}
