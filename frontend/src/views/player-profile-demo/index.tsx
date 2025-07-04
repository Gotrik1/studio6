
import PlayerClient from "@/app/(app)/administration/player/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";

// For demo purposes, we fetch a hardcoded user ID.
// In a real profile page, this would come from `params`.
const DEMO_USER_ID = '1'; 

export async function PlayerProfilePage() {
    // This now fetches from the backend API
    const profileData = await getPlayerProfile(DEMO_USER_ID);

    if (!profileData) {
        notFound();
    }
    
    // In a real app, you would also check if the session user is viewing their own profile.
    const isCurrentUser = true; // Mocked for demo

    return <PlayerClient 
        user={profileData.user} 
        isCurrentUser={isCurrentUser}
        achievements={profileData.achievements}
        teams={profileData.teams}
        gallery={profileData.gallery}
        careerHistory={profileData.careerHistory}
        playerActivity={profileData.playerActivity}
    />;
}
