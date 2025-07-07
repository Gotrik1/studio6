

'use client';

import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import type { FullUserProfile, PlayerStats, CareerHistoryItem, GalleryItem } from '@/entities/user/model/types';
import * as LucideIcons from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { getPlayerStats } from "./get-player-stats";
import { getAchievementsForUser } from '@/entities/achievement/api/achievements';
import type { Achievement } from '@/entities/achievement/model/types';
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
    const metadata = activity.metadata as Record<string, string>;
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
        case 'PLAYGROUND_CHECK_IN':
            return metadata.comment || 'Отметился на площадке.';
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
    
    const playerActivity: PlayerActivityItem[] = (profileResult.user.activities || []).map((activity) => {
        const metadata = activity.metadata as Record<string, string>;
        const IconName = (metadata.icon as keyof typeof LucideIcons) || 'HelpCircle';
        return {
            id: activity.id,
            type: activity.type,
            icon: IconName,
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
        
        if (!result.success || !result.data) {
            console.error(`Failed to fetch user ${id}:`, result.error);
            return null;
        }

        const rawProfile = result.data;
        
        const augmentedProfile: FullUserProfile = {
            ...rawProfile,
             activitySummary: `Пользователь с ${format(
                new Date(rawProfile.createdAt),
                "yyyy",
            )} года. Последняя активность: ${formatDistanceToNow(new Date(rawProfile.updatedAt), {
                addSuffix: true,
                locale: ru,
            })}.`,
            profileUrl: `/profiles/player/${rawProfile.id}`,
            gallery: (rawProfile.gallery || []) as GalleryItem[],
            careerHistory: (rawProfile.careerHistory || []) as CareerHistoryItem[],
            activities: (rawProfile.activities || []).map((act) => ({...act, id: String(act.id), timestamp: act.createdAt })),
        };

        return {
            user: augmentedProfile,
        };

    } catch(error) {
        console.error(`Error fetching user profile for ${id}:`, error);
        return null;
    }
}
