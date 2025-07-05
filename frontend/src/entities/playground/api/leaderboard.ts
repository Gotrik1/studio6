
'use server';

import type { Playground } from '@/entities/playground/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type PlaygroundLeaderboardItem = {
    id: string;
    rank: number;
    name: string;
    avatar: string | null;
    checkIns: number;
};

// Backend sends: { id: number, playerName: string, score: number, avatarUrl: string }
export async function getPlaygroundLeaderboard(playgroundId: string): Promise<PlaygroundLeaderboardItem[]> {
    // In a real app, you would use the playgroundId in the URL
    // const result = await fetchWithAuth(`/playgrounds/${playgroundId}/leaderboard`);
    // if (!result.success) return [];
    // const backendData = result.data;
    
    // For now, let's use mock data that simulates the backend response
    const mockBackendResponse = [
        { id: 1, playerName: 'Superuser', score: 45, avatarUrl: 'https://placehold.co/40x40.png' },
        { id: 2, playerName: 'Reaper', score: 32, avatarUrl: 'https://placehold.co/40x40.png' },
        { id: 3, playerName: 'Echo', score: 28, avatarUrl: 'https://placehold.co/40x40.png' },
    ];
    
    // This is the Adapter part. It transforms the backend data into the frontend format.
    const adaptedData = mockBackendResponse.map((item, index) => ({
        id: String(item.id),
        rank: index + 1,
        name: item.playerName,
        avatar: item.avatarUrl,
        checkIns: item.score,
    }));

    // In a real app, you would process `result.data` here
    return Promise.resolve(adaptedData);
}
