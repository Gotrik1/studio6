
'use server';

import type { User } from '@/shared/lib/types';
import { achievements, teams, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";


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
    activities: any[];
};

// This is a temporary type for the full page props
export type FullPlayerProfile = {
    user: PlayerProfileData;
    achievements: typeof achievements;
    teams: typeof teams;
    gallery: typeof gallery;
    careerHistory: typeof careerHistory;
    playerActivity: PlayerActivityItem[]; // This will be replaced by user.activities
};


export async function getPlayerProfile(id: string): Promise<FullPlayerProfile | null> {
    try {
        const userRes = fetch(`${process.env.BACKEND_URL}/users/${id}`, { cache: 'no-store' });
        const teamsRes = fetch(`${process.env.BACKEND_URL}/users/${id}/teams`, { cache: 'no-store' });
        
        const [userResponse, teamsResponse] = await Promise.all([userRes, teamsRes]);
        
        if (!userResponse.ok) {
            console.error(`Failed to fetch user ${id}:`, userResponse.statusText);
            return null;
        }

        const user: PlayerProfileData = await userResponse.json();
        // Gracefully handle if teams fetch fails
        const userTeams = teamsResponse.ok ? await teamsResponse.json() : [];
        
        // Transform backend activities to frontend format
        const playerActivity: PlayerActivityItem[] = user.activities.map((activity: any) => {
            const metadata = activity.metadata as any;
            let text = `Неизвестное событие`;
            
            if (activity.type === 'MATCH_PLAYED') {
                 text = `Сыграл матч за <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.team}</a> против <a href="#" class="font-bold hover:underline">${metadata.opponent}</a>. <span class="${metadata.result === 'Победа' ? 'text-green-500' : 'text-red-500'} font-bold">${metadata.result} ${metadata.score}</span>.`;
            }
            
            return {
                id: activity.id,
                type: activity.type,
                icon: metadata.icon || 'HelpCircle',
                text: text,
                timestamp: activity.timestamp,
            }
        }).filter((item): item is PlayerActivityItem => item !== null);


        return {
            user,
            teams: userTeams, // Use real data
            playerActivity, // Use real data
            // These remain mock for now, as per the plan.
            achievements,
            gallery,
            careerHistory,
        };

    } catch(error) {
        console.error(`Error fetching user profile for ${id}:`, error);
        return null;
    }
}
