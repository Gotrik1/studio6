
'use server';

import type { User } from '@/shared/lib/types';
import { achievements, teams, recentMatches, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";
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
    recentMatches: typeof recentMatches;
    gallery: typeof gallery;
    careerHistory: typeof careerHistory;
    playerActivity: PlayerActivityItem[];
};


// In a real app, you would fetch all this data from different services
// For now, we only fetch the user data from our backend.
export async function getPlayerProfile(id: string): Promise<FullPlayerProfile | null> {
    try {
        const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/users/${id}`, {
            cache: 'no-store',
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch user ${id}:`, res.statusText);
            return null;
        }

        const user: PlayerProfileData = await res.json();
        
        return {
            user,
            achievements,
            teams,
            recentMatches,
            gallery,
            careerHistory,
            playerActivity,
        };

    } catch(error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
}
