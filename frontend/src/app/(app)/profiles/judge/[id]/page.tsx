
import JudgeClient from "@/app/(app)/administration/judge/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { judgeAchievements } from "@/shared/lib/mock-data/judge-profile";

export default async function JudgeProfileRoute({ params }: { params: { id: string } }) {
    const profileData = await getPlayerProfile(params.id);
    
    if (!profileData) {
        notFound();
    }

    // In a real app, you would probably have different achievements per role
    return (
        <JudgeClient 
            user={profileData.user} 
            achievements={judgeAchievements} 
        />
    );
}
