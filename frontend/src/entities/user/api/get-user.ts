

'use server';

import type { User } from '@/shared/lib/types';
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import type { CoachedPlayerSummary, FullUserProfile } from '@/entities/user/model/types';
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
        
        const playerActivity: PlayerActivityItem[] = (profileData.activities || []).map((activity: any) => {
            const metadata = activity.metadata as any;
            let text = `Неизвестное событие`;
            
            if (activity.type === 'MATCH_PLAYED') {
                 text = `Сыграл матч за <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.team}</a> против <a href="#" class="font-bold hover:underline">${metadata.opponent}</a>. <span class="${metadata.result === 'Победа' ? 'text-green-500' : 'text-red-500'} font-bold">${metadata.result} ${metadata.score}</span>.`;
            } else if (activity.type === 'TEAM_JOINED') {
                text = `Присоединился к команде <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.teamName}</a>.`;
            } else if (activity.type === 'TOURNAMENT_REGISTERED') {
                 text = `Зарегистрировал команду <a href="#" class="font-bold hover:underline">${metadata.teamName}</a> на турнир <a href="${metadata.tournamentHref}" class="font-bold hover:underline">${metadata.tournamentName}</a>.`;
            }
            
            return {
                id: String(activity.id),
                type: activity.type,
                icon: metadata.icon || 'HelpCircle',
                text: text,
                timestamp: activity.timestamp,
            }
        }).filter((item: any): item is PlayerActivityItem => item !== null);
        
        // Adapt nested coaching data
        const coachedPlayers: CoachedPlayerSummary[] = (rawProfile.coaching || []).map((player: any) => ({
            id: String(player.id),
            name: player.name,
            avatar: player.avatar || null,
            role: player.role,
            mainSport: player.mainSport || 'не указан',
            adherence: player.adherence,
        }));

        const augmentedProfile: FullUserProfile = {
            ...profileData,
            activities: playerActivity,
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

export async function getUsers(): Promise<User[]> {
    const result = await fetchWithAuth('/users');
    if (result.success) {
        return result.data;
    }
    console.error('Failed to fetch users:', result.error);
    return [];
}
