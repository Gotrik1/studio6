
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { LfgLobby } from '@/entities/lfg/model/types';

export async function getPlaygroundSchedule(playgroundId: string): Promise<LfgLobby[]> {
    const result = await fetchWithAuth(`/playgrounds/${playgroundId}/schedule`);
    if (!result.success || !Array.isArray(result.data)) {
        if (!result.success) {
            console.error(`Failed to fetch schedule for playground ${playgroundId}:`, result.error);
        }
        return [];
    }
    
    // Convert date strings to Date objects
    return result.data.map((lobby: any) => ({
        ...lobby,
        startTime: new Date(lobby.startTime),
        endTime: new Date(lobby.endTime),
    }));
}
