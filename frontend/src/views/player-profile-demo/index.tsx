

import PlayerClient from "@/app/(app)/administration/player/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getPlayerStats } from "@/entities/user/api/get-player-stats";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";
import { getSession } from "@/features/auth/session";
import { notFound } from "next/navigation";

// This file is now obsolete as profile pages are handled dynamically.
// Kept for reference or potential future use.

// For demo purposes, we fetch a hardcoded user ID.
// In a real profile page, this would come from `params`.
const DEMO_USER_ID = '1'; 

export async function PlayerProfilePage() {
    // This now fetches from the backend API
    const [profileData, statsData, session, achievementsData] = await Promise.all([
        getPlayerProfile(DEMO_USER_ID),
        getPlayerStats(DEMO_USER_ID),
        getSession(),
        getAchievementsForUser(DEMO_USER_ID),
    ]);

    if (!profileData || !session?.user) {
        notFound();
    }
    
    // In a real app, you would also check if the session user is viewing their own profile.
    const isCurrentUser = session.user.id === profileData.user.id; 

    return <PlayerClient 
        user={profileData.user} 
        isCurrentUser={isCurrentUser}
        achievements={achievementsData}
        teams={profileData.user.teams}
        gallery={profileData.user.gallery}
        careerHistory={profileData.user.careerHistory}
        playerActivity={profileData.user.activities}
        stats={statsData}
    />;
}
