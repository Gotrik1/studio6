'use server';

import type { TeamDetails } from '@/entities/team/model/types';

export async function getTeamBySlug(slug: string): Promise<TeamDetails | null> {
    try {
        const res = await fetch(`/api/teams/slug/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return null; // Handle 404 or other errors gracefully
        }
        
        const team = await res.json();
        return team;

    } catch (error) {
        console.error(`Failed to fetch team by slug ${slug}:`, error);
        return null;
    }
}
