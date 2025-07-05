import JudgeClient from "@/app/(app)/administration/judge/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { judgeAchievements } from "@/shared/lib/mock-data/judge-profile";

const DEMO_JUDGE_ID = '4'; // Николай Васильев

export async function JudgeProfilePage() {
    const profileData = await getPlayerProfile(DEMO_JUDGE_ID);
    
    if (!profileData) {
        notFound();
    }

    return <JudgeClient user={profileData.user} achievements={judgeAchievements} />;
}
