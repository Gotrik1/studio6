'use server';

import type { Match } from '@/entities/match/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type TeamDashboardData = {
    upcomingMatch: Match | null;
    recentResults: Match[];
};

export async function getTeamDashboardData(teamId: string): Promise<TeamDashboardData | null> {
    const result = await fetchWithAuth(`/teams/${teamId}/dashboard`);
    
    if (!result.success) {
        console.error(`Failed to fetch dashboard data for team ${teamId}:`, result.error);
        return null;
    }
    
    return result.data;
}
