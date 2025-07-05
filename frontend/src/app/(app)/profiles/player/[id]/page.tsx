
import PlayerClient from "@/app/(app)/administration/player/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getSession } from "@/features/auth/session";
import { notFound } from "next/navigation";

export default async function PlayerProfileRoute({ params }: { params: { id: string } }) {
    const [profileData, session] = await Promise.all([
        getPlayerProfile(params.id),
        getSession(),
    ]);

    if (!profileData || !session?.user) {
        notFound();
    }
    
    const isCurrentUser = session.user.id === profileData.user.id;

    return <PlayerClient 
        user={profileData.user} 
        isCurrentUser={isCurrentUser}
        achievements={profileData.achievements}
        teams={profileData.user.teams}
        gallery={profileData.user.gallery}
        careerHistory={profileData.user.careerHistory}
        playerActivity={profileData.user.activities}
    />;
}
