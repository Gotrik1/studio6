

import CoachClient from "@/app/(app)/administration/coach/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import type { CoachedPlayer, CoachedPlayerSummary } from '@/entities/user/model/types';
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";

const DEMO_COACH_ID = '3'; // Maria 'Shadow' Petrova will be our demo coach

export async function CoachProfilePage() {
    const profileData = await getPlayerProfile(DEMO_COACH_ID);
    const achievements = await getAchievementsForUser(DEMO_COACH_ID);

    if (!profileData) {
        notFound();
    }
    
    // In a real app, coachedPlayers would be fetched with full stats.
    // For now, we augment the basic user data from the backend with mock stats for UI compatibility.
    const coachedPlayers: CoachedPlayer[] = (profileData.user.coaching || []).map((player: CoachedPlayerSummary) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar || null,
        avatarHint: 'esports player portrait',
        role: player.role,
        mainSport: player.mainSport,
        // Mock stats and history as the backend doesn't provide this level of detail yet
        stats: { kda: '1.2', winRate: '55%', favoriteMap: 'Ascent' },
        matchHistory: 'W 13-8, L 10-13, W 13-2',
        adherence: player.adherence ?? Math.floor(Math.random() * (98 - 75 + 1) + 75),
        progress: Math.floor(Math.random() * (25 - 5 + 1) + 5),
    }));
    
    return (
        <CoachClient 
            user={profileData.user}
            achievements={achievements}
            players={coachedPlayers}
        />
    );
}
