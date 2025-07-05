
'use server';

import type { TournamentDetails } from '@/entities/tournament/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getTournamentBySlug(slug: string): Promise<TournamentDetails | null> {
    const result = await fetchWithAuth(`/tournaments/slug/${slug}`);
    
    if (!result.success) {
        console.error(`Failed to fetch tournament ${slug}:`, result.error);
        return null;
    }
    
    const tournament = result.data;
    return tournament;
}

export async function getTournamentById(id: string): Promise<TournamentDetails | null> {
    const result = await fetchWithAuth(`/tournaments/${id}`);
    
    if (!result.success) {
        console.error(`Failed to fetch tournament ${id}:`, result.error);
        return null;
    }
    
    const tournament = result.data;
    return tournament;
}
