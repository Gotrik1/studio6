
import type { User } from '@/shared/lib/types';
import type { achievements as AchievementsArray, teams as TeamsArray, recentMatches as MatchesArray, gallery as GalleryArray, careerHistory as CareerHistoryArray } from "@/shared/lib/mock-data/profiles";

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
    achievements: typeof AchievementsArray;
    teams: typeof TeamsArray;
    recentMatches: typeof MatchesArray;
    gallery: typeof GalleryArray;
    careerHistory: typeof CareerHistoryArray;
    playerActivity: any; // Using 'any' to avoid circular dependency issues with player-activity mock
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
        
        // Return user data from API combined with mock data for other sections
        const { achievements, teams, recentMatches, gallery, careerHistory } = require("@/shared/lib/mock-data/profiles");
        const { playerActivity } = require("@/shared/lib/mock-data/player-activity");

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
