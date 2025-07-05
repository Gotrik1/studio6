'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { PlayerStats } from '../model/types';

export async function getPlayerStats(userId: string): Promise<PlayerStats | null> {
    const result = await fetchWithAuth(`/users/${userId}/stats`);
    if (!result.success) {
        console.error('Failed to fetch player stats:', result.error);
        return null;
    }
    return result.data;
}
