'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import type { Achievement } from '../model/types';

export async function getAchievementsForUser(userId: string): Promise<Achievement[]> {
    const result = await fetchWithAuth(`/users/${userId}/achievements`);
    if (result.success && Array.isArray(result.data)) {
        return result.data;
    }
    console.error(`Failed to fetch achievements for user ${userId}:`, result.error);
    return [];
}
