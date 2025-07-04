
'use server';

import type { TournamentDetails } from '@/entities/tournament/model/types';

export async function getTournamentBySlug(slug: string): Promise<TournamentDetails | null> {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/tournaments/slug/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`Failed to fetch tournament ${slug}:`, res.statusText);
            return null;
        }
        
        const tournament = await res.json();
        return tournament;
    } catch (error) {
        console.error(`Failed to fetch tournament ${slug}:`, error);
        return null;
    }
}
