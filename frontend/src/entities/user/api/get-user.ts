
'use server';

import type { User } from '@/shared/lib/types';
import { achievements } from "@/shared/lib/mock-data/profiles";
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";
import type { UserTeam, CareerHistoryItem, GalleryItem } from '@/entities/user/model/types';

// Define the rich user profile type that the frontend expects
export type PlayerProfileData = User & {
    location: string;
    mainSport: string;
    status: string;
    isVerified: boolean;
    xp: number;
    dateOfBirth: string;
    age: number;
    preferredSports: string[];
    contacts: { telegram: string; discord: string };
    activities: PlayerActivityItem[];
    teams: UserTeam[];
    gallery: GalleryItem[];
    careerHistory: CareerHistoryItem[];
};

// This is the type for the full page props
export type FullPlayerProfile = {
    user: PlayerProfileData;
    achievements: typeof achievements;
};


export async function getPlayerProfile(id: string): Promise<FullPlayerProfile | null> {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/users/${id}`, { cache: 'no-store' });
        
        if (!res.ok) {
            console.error(`Failed to fetch user ${id}:`, res.statusText);
            return null;
        }

        const profileData = await res.json();
        
        // Transform backend activities to frontend format
        const playerActivity: PlayerActivityItem[] = profileData.activities.map((activity: any) => {
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
                id: activity.id,
                type: activity.type,
                icon: metadata.icon || 'HelpCircle',
                text: text,
                timestamp: activity.timestamp,
            }
        }).filter((item): item is PlayerActivityItem => item !== null);
        
        // The backend now returns an augmented user object that includes teams, gallery, and careerHistory.
        // We just need to add the mocked achievements.
        const augmentedProfile: PlayerProfileData = {
            ...profileData,
            activities: playerActivity,
        };

        return {
            user: augmentedProfile,
            // Achievements are still mocked on the frontend, as there's no backend system for them yet.
            achievements,
        };

    } catch(error) {
        console.error(`Error fetching user profile for ${id}:`, error);
        return null;
    }
}
