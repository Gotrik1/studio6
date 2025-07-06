


'use server';

import type { User } from '@/shared/lib/types';
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import type { CoachedPlayerSummary, FullUserProfile, PlayerStats, CareerHistoryItem, GalleryItem, Activity } from '@/entities/user/model/types';
import type { UserTeam } from '@/entities/team/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { getPlayerStats } from "./get-player-stats";
import { getAchievementsForUser } from '@/entities/achievement/api/achievements';
import type { Achievement } from '@/entities/achievement/model/types';
import type { TournamentCrm, JudgedMatch } from '@/entities/user/model/types';
import * as LucideIcons from 'lucide-react';

export type { FullUserProfile, PlayerStats };

// This is the type for the full page props, combining multiple data sources
export type PlayerProfilePageData = {
    user: FullUserProfile;
    stats: PlayerStats | null;
    achievements: Achievement[];
    playerActivity: PlayerActivityItem[];
};


const formatActivityText = (activity: Activity): string => {
    const metadata = activity.metadata as any; // Cast to any to access dynamic properties
    switch(activity.type) {
        case 'STATUS_POSTED':
            return metadata.text;
        case 'MATCH_PLAYED':
            return `Сыграл матч за <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.team}</a> против <a href="#" class="font-bold hover:underline">${metadata.opponent}</a>. <span class="${metadata.result === 'Победа' ? 'text-green-500' : 'text-red-500'} font-bold">${metadata.result} ${metadata.score}</span>.`;
        case 'TEAM_JOINED':
            return `Присоединился к команде <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.teamName}</a>.`;
        case 'TOURNAMENT_REGISTERED':
             return `Зарегистрировал команду <a href="#" class="font-bold hover:underline">${metadata.teamName}</a> на турнир <a href="${metadata.tournamentHref}" class="font-bold hover:underline">${metadata.tournamentName}</a>.`;
        case 'ACHIEVEMENT_UNLOCKED':
             return `Разблокировано достижение: <span class="font-bold">${metadata.title}</span>`;
        default:
            return 'Совершил(а) новое действие.';
    }
}


export async function getPlayerProfilePageData(id: string): Promise<PlayerProfilePageData | null> {
    const [profileResult, statsResult, achievementsResult] = await Promise.all([
        getPlayerProfile(id),
        getPlayerStats(id),
        getAchievementsForUser(id),
    ]);
    
    if (!profileResult) {
        return null;
    }
    
    const playerActivity: PlayerActivityItem[] = profileResult.user.activities.map(activity => {
        const metadata = activity.metadata as any; // Allow dynamic property access
        const IconName = metadata.icon as keyof typeof LucideIcons;
        return {
            id: activity.id,
            type: activity.type,
            icon: IconName || 'HelpCircle',
            text: formatActivityText(activity),
            createdAt: activity.createdAt,
        };
    });

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
        const profileData: FullUserProfile = {
            ...rawProfile,
            id: String(rawProfile.id),
            name: rawProfile.fullName || rawProfile.name,
            avatar: rawProfile.avatarUrl || rawProfile.avatar,
        };
        
        const coachedPlayers: CoachedPlayerSummary[] = (rawProfile.coaching || []).map((player: CoachedPlayerSummary) => ({
            id: String(player.id),
            name: player.name,
            avatar: player.avatar || null,
            role: player.role,
            mainSport: player.mainSport || 'не указан',
            adherence: player.adherence,
        }));

        const augmentedProfile: FullUserProfile = {
            ...profileData,
            activities: (profileData.activities || []).map(act => ({...act, id: String(act.id)})),
            coaching: coachedPlayers, // Use adapted data
            teams: (rawProfile.teams || []).map((team: UserTeam) => ({
                ...team,
                id: String(team.id),
                logo: team.logo || null,
            })),
            judgedMatches: (rawProfile.judgedMatches || []).map((match: JudgedMatch) => ({
                ...match,
                id: String(match.id),
                team1: { name: match.team1.name },
                team2: { name: match.team2.name },
            })),
            organizedTournaments: (rawProfile.organizedTournaments || []).map((t: TournamentCrm) => ({
                ...t,
                id: String(t.id),
            }))
        };

        return {
            user: augmentedProfile,
        };

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
