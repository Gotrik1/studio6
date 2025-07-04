
import PlayerClient from "@/app/(app)/administration/player/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getSession } from "@/features/auth/session";
import { notFound } from "next/navigation";

export default async function PlayerProfileRoute({ params }: { params: { id: string } }) {
    const [profileData, sessionUser] = await Promise.all([
        getPlayerProfile(params.id),
        getSession(),
    ]);

    if (!profileData || !sessionUser) {
        notFound();
    }
    
    const isCurrentUser = sessionUser.id === profileData.user.id;

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
