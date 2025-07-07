

'use server';

import type { MatchDetails } from '@/entities/match/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getMatchById(id: string): Promise<MatchDetails | null> {
    const result = await fetchWithAuth<MatchDetails>(`/matches/${id}`);
    
    if (!result.success) {
        console.error(`Failed to fetch match ${id}:`, result.error);
        return null;
    }
    
    return result.data;
}


export async function getMatchOfTheWeek(): Promise<MatchDetails | null> {
     const result = await fetchWithAuth<MatchDetails>(`/matches/match-of-the-week`);
     if (!result.success) {
        console.error('Failed to fetch match of the week:', result.error);
        return null;
    }
    return result.data;
}
