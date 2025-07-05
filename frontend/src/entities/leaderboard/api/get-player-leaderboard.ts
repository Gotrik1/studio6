'use server';

import type { PlayerLeaderboardItem } from '@/entities/leaderboard/model/types';
export type { PlayerLeaderboardItem };

export async function getPlayerLeaderboard(): Promise<PlayerLeaderboardItem[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/users/leaderboard`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch player leaderboard:', response.statusText);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching player leaderboard:', error);
        return [];
    }
}
