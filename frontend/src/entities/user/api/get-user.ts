
'use server';

import type { User } from '@/shared/lib/types';
import { achievements, teams, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";
import { playerActivity, type PlayerActivityItem } from "@/shared/lib/mock-data/player-activity";


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
};

// This is a temporary type for the full page props
export type FullPlayerProfile = {
    user: PlayerProfileData;
    achievements: typeof achievements;
    teams: typeof teams;
    gallery: typeof gallery;
    careerHistory: typeof careerHistory;
    playerActivity: PlayerActivityItem[];
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
        
        return {
            user,
            teams: userTeams, // Use real data
            // These remain mock for now, as per the plan.
            achievements,
            gallery,
            careerHistory,
            playerActivity,
        };

    } catch(error) {
        console.error(`Error fetching user profile for ${id}:`, error);
        return null;
    }
}
