

'use server';

import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import type { CoachedPlayerSummary, FullUserProfile, PlayerStats, UserTeam, JudgedMatch, TournamentCrm } from '@/entities/user/model/types';
import * as LucideIcons from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { getPlayerStats } from "./get-player-stats";
import { getAchievementsForUser } from '@/entities/achievement/api/achievements';
import type { Achievement } from '@/entities/achievement/model/types';
import type { User as BaseUser } from '@/shared/lib/types';
import type { Activity } from '@/entities/feed/model/types';


export type { FullUserProfile, PlayerStats };

// This is the type for the full page props, combining multiple data sources
export type PlayerProfilePageData = {
    user: FullUserProfile;
    stats: PlayerStats | null;
    achievements: Achievement[];
    playerActivity: PlayerActivityItem[];
};

const formatActivityText = (activity: Activity): string => {
    const metadata: Record<string, string> = activity.metadata as Record<string, string>;
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
            // This case should ideally not be reached if all types are handled
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
    
    const playerActivity: PlayerActivityItem[] = (profileResult.user.activities || []).map((activity: Activity) => {
        const metadata: Record<string, string> = activity.metadata as Record<string, string>;
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
        const result = await fetchWithAuth<FullUserProfile>(`/users/${id}`);
        
        if (!result.success) {
            console.error(`Failed to fetch user ${id}:`, result.error);
            return null;
        }

        const rawProfile = result.data;
        
        const coachedPlayers: CoachedPlayerSummary[] = (rawProfile.coaching || []).map((player) => ({
            id: String(player.id),
            name: player.name,
            avatar: player.avatar || null,
            role: player.role,
            mainSport: player.mainSport || 'не указан',
            adherence: player.adherence,
        }));

        const augmentedProfile: FullUserProfile = {
            ...rawProfile,
            activities: (rawProfile.activities || []).map((act: Activity) => ({...act, id: String(act.id)})),
            coaching: coachedPlayers, // Use adapted data
            teams: (rawProfile.teams || []).map((team) => ({
                ...team,
                id: String(team.id),
                logo: team.logo || null,
            })),
            gallery: [],
            careerHistory: [],
            judgedMatches: (rawProfile.judgedMatches || []).map((match) => ({
                ...match,
                id: String(match.id),
                team1: { name: match.team1.name },
                team2: { name: match.team2.name },
            })),
            organizedTournaments: (rawProfile.organizedTournaments || []).map((t) => ({
                ...t,
                id: String(t.id),
            })),
             activitySummary: `Пользователь с ${format(
                new Date(rawProfile.createdAt),
                "yyyy",
            )} года. Последняя активность: ${formatDistanceToNow(new Date(rawProfile.updatedAt), {
                addSuffix: true,
                locale: ru,
            })}.`,
            profileUrl: `/profiles/player/${rawProfile.id}`,
        };

        return {
            user: augmentedProfile,
        };

    } catch(error) {
        console.error(`Error fetching user profile for ${id}:`, error);
        return null;
    }
}


export async function getUsers(): Promise<BaseUser[]> {
    const result = await fetchWithAuth('/users');
    if (result.success && Array.isArray(result.data)) {
        return result.data;
    }
    if (!result.success) {
        console.error('Failed to fetch users:', result.error);
    }
    return [];
}
