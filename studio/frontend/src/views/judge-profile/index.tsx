import { judgeUser, judgeAchievements } from "@/shared/lib/mock-data/judge-profile";
import JudgeClient from "@/app/(app)/administration/judge/client";

export function JudgeProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = judgeUser;
    const achievements = judgeAchievements;

    return <JudgeClient user={user} achievements={achievements} />;
}
