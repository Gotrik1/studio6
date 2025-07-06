

import PlayerClient from "@/app/(app)/administration/player/client";
import { getPlayerProfilePageData } from "@/entities/user/api/get-user";
import { getSession } from "@/features/auth/session";
import { notFound } from "next/navigation";

export default async function PlayerProfileRoute({ params }: { params: { id: string } }) {
    const [pageData, session] = await Promise.all([
        getPlayerProfilePageData(params.id),
        getSession(),
    ]);

    if (!pageData || !session?.user) {
        notFound();
    }
    
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
