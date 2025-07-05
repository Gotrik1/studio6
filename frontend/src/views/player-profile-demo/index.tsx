
import PlayerClient from "@/app/(app)/administration/player/client";
import { getPlayerProfilePageData } from "@/entities/user/api/get-user";
import { getSession } from "@/features/auth/session";
import { notFound } from "next/navigation";

// This file is now obsolete as profile pages are handled dynamically.
// Kept for reference or potential future use.

// For demo purposes, we fetch a hardcoded user ID.
// In a real profile page, this would come from `params`.
const DEMO_USER_ID = '1'; 

export async function PlayerProfilePage() {
    const [pageData, session] = await Promise.all([
        getPlayerProfilePageData(DEMO_USER_ID),
        getSession(),
    ]);

    if (!pageData || !session?.user) {
        notFound();
    }
    
    // In a real app, you would also check if the session user is viewing their own profile.
    const isCurrentUser = session.user.id === pageData.user.id; 

    return <PlayerClient 
        user={pageData.user} 
        isCurrentUser={isCurrentUser}
        achievements={pageData.achievements}
        teams={pageData.user.teams}
        gallery={pageData.user.gallery}
        careerHistory={pageData.user.careerHistory}
        playerActivity={pageData.playerActivity}
        stats={pageData.stats}
    />;
}
