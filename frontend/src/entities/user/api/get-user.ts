
'use server';

import type { User } from '@/shared/lib/types';
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import type { UserTeam, CareerHistoryItem, GalleryItem, TournamentCrm, CoachedPlayer, JudgedMatch } from '@/entities/user/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { achievements } from '@/shared/lib/mock-data/profiles';

// Define the rich user profile type that the frontend expects
export type FullUserProfile = User & {
    location: string;
    mainSport: string;
    isVerified: boolean;
    dateOfBirth: string;
    age: number;
    preferredSports: string[];
    contacts: { telegram: string; discord: string };
    activities: PlayerActivityItem[];
    teams: UserTeam[];
    gallery: GalleryItem[];
    careerHistory: CareerHistoryItem[];
    organizedTournaments?: TournamentCrm[];
    coaching?: CoachedPlayer[]; // A coach has players they are coaching
    judgedMatches?: JudgedMatch[];
};

// This is the type for the full page props
export type PlayerProfileData = {
    user: FullUserProfile;
    achievements: typeof achievements;
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
            id: String(rawProfile.id), // Ensure ID is a string
            name: rawProfile.fullName || rawProfile.name, // Adapt name
            avatar: rawProfile.avatarUrl || rawProfile.avatar, // Adapt avatar
        };
        
        // Transform backend activities to frontend format
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
        
        const augmentedProfile: FullUserProfile = {
            ...profileData,
            activities: playerActivity,
        };

        return {
            user: augmentedProfile,
            achievements: achievements, // Add mock achievements as the component expects them
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
