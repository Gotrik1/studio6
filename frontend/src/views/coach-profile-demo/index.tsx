import { coachUser, coachAchievements } from "@/shared/lib/mock-data/coach-profile";
import CoachClient from "@/app/(app)/administration/coach/client";

export function CoachProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = coachUser;
    const achievements = coachAchievements;

    return <CoachClient user={user} achievements={achievements} />;
}
