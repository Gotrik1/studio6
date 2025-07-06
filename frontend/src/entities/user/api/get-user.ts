
'use server';

import type { User } from '@/shared/lib/types';
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import { CoachedPlayerSummary, FullUserProfile, PlayerStats } from '@/entities/user/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { getPlayerStats } from "./get-player-stats";
import { getAchievementsForUser } from '@/entities/achievement/api/achievements';
import type { Achievement } from '@/entities/achievement/model/types';

export type { FullUserProfile };

// This is the type for the full page props, combining multiple data sources
export type PlayerProfilePageData = {
    user: FullUserProfile;
    stats: PlayerStats | null;
    achievements: Achievement[];
    playerActivity: PlayerActivityItem[];
};


export async function getPlayerProfilePageData(id: string): Promise<PlayerProfilePageData | null> {
    const [profileResult, statsResult, achievementsResult] = await Promise.all([
        getPlayerProfile(id),
        getPlayerStats(id),
        getAchievementsForUser(id),
    ]);
    
    if (!profileResult) {
        return null;
    }
    
    // The playerActivity is already part of the profileResult, so we extract it.
    const playerActivity = profileResult.user.activities as PlayerActivityItem[];

    return {
        user: profileResult.user,
        stats: statsResult,
        achievements: achievementsResult,
        playerActivity,
    };
}


export async function getPlayerProfile(id: string): Promise<{ user: FullUserProfile; } | null> {
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
        } as unknown as { user: FullUserProfile };

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
