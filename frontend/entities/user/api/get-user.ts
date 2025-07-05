

'use server';

import type { FullUserProfile, CoachedPlayerSummary } from '@/entities/user/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

// This is the type for the full page props, now simplified
export type PlayerProfileData = {
    user: FullUserProfile;
};


export async function getPlayerProfile(id: string): Promise<PlayerProfileData | null> {
    try {
        const result = await fetchWithAuth(`/users/${id}`);
        
        if (!result.success) {
            console.error(`Failed to fetch user ${id}:`, result.error);
            return null;
        }

        const rawProfile = result.data;
        
        // Adapter for user data to ensure consistency between frontend and backend
        const profileData = {
            ...rawProfile,
            id: String(rawProfile.id),
            name: rawProfile.fullName || rawProfile.name,
            avatar: rawProfile.avatarUrl || rawProfile.avatar,
        };
        
        const coachedPlayers: CoachedPlayerSummary[] = (rawProfile.coaching || []).map((player: any) => ({
            id: String(player.id),
            name: player.name,
            avatar: player.avatar || null,
            role: player.role,
            mainSport: player.mainSport || 'не указан',
        }));

        const augmentedProfile: FullUserProfile = {
            ...profileData,
            coaching: coachedPlayers, // Use adapted data
            // Also adapt other nested arrays for consistency
            teams: (rawProfile.teams || []).map((team: any) => ({
                ...team,
                id: String(team.id),
                logo: team.logoUrl || team.logo || null,
            })),
            judgedMatches: (rawProfile.judgedMatches || []).map((match: any) => ({
                ...match,
                id: String(match.id),
                team1: { name: match.team1.name },
                team2: { name: match.team2.name },
            })),
            organizedTournaments: (rawProfile.organizedTournaments || []).map((t: any) => ({
                ...t,
                id: String(t.id),
            }))
        };

        return {
            user: augmentedProfile,
        } as unknown as PlayerProfileData; // The cast is needed because of the complexity

    } catch(error) {
        console.error(`Error fetching user profile for ${id}:`, error);
        return null;
    }
}
