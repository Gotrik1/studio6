
'use server';

import type { TeamLeaderboardItem } from '@/entities/leaderboard/model/types';

export async function getTeamLeaderboard(): Promise<TeamLeaderboardItem[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/teams/leaderboard`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch team leaderboard:', response.statusText);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching team leaderboard:', error);
        return [];
    }
}
