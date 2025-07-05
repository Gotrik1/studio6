import CoachClient from "@/app/(app)/administration/coach/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import type { CoachedPlayer } from '@/entities/user/model/types';
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";
import { augmentCoachedPlayer } from "@/entities/user/lib/augment-coached-player";

const DEMO_COACH_ID = '3'; // Maria 'Shadow' Petrova will be our demo coach

export async function CoachProfilePage() {
    const [profileData, achievementsData] = await Promise.all([
        getPlayerProfile(DEMO_COACH_ID),
        getAchievementsForUser(DEMO_COACH_ID),
    ]);

    if (!profileData) {
        notFound();
    }
    
    // Augment the summary data from the backend with mock stats for full UI compatibility.
    const coachedPlayers: CoachedPlayer[] = (profileData.user.coaching || []).map(augmentCoachedPlayer);
    
    return (
        <CoachClient 
            user={profileData.user}
            achievements={achievementsData}
            players={coachedPlayers}
        />
    );
}
