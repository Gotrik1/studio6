'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export type PlaygroundLeaderboardItem = {
    id: string;
    rank: number;
    name: string;
    avatar: string | null;
    checkIns: number;
};

export async function getPlaygroundLeaderboard(playgroundId: string): Promise<PlaygroundLeaderboardItem[]> {
    const result = await fetchWithAuth(`/playgrounds/${playgroundId}/leaderboard`);
    
    if (!result.success) {
        console.error(`Failed to fetch leaderboard for playground ${playgroundId}:`, result.error);
        return [];
    }

    if (Array.isArray(result.data)) {
        return result.data.map((item: any) => ({
            ...item,
            id: String(item.id),
        }));
    }
    
    return [];
}
