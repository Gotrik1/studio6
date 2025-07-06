

import JudgeClient from "@/app/(app)/administration/judge/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from '@/entities/achievement/api/achievements';


const DEMO_JUDGE_ID = '4'; // Николай Васильев

export async function JudgeProfilePage() {
    const [profileData, achievements] = await Promise.all([
        getPlayerProfile(DEMO_JUDGE_ID),
        getAchievementsForUser(DEMO_JUDGE_ID),
    ]);
    
    if (!profileData) {
        notFound();
    }

    return <JudgeClient user={profileData.user} achievements={achievements} />;
}
