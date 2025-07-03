
'use server';

import type { MatchDetails } from '@/entities/match/model/types';


export async function getMatchById(id: string): Promise<MatchDetails | null> {
    try {
        const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/matches/${id}`, {
            cache: 'no-store',
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch match ${id}:`, res.statusText);
            return null;
        }

        const match = await res.json();
        return match;
    } catch(error) {
        console.error(`Error fetching match ${id}:`, error);
        return null;
    }
}
