
import { moderatorUser, moderatorAchievements } from "@/shared/lib/mock-data/moderator-profile";
import ModeratorClient from "@/app/(app)/administration/moderator/client";

export function ModeratorProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = moderatorUser;
    const achievements = moderatorAchievements;

    return <ModeratorClient user={user} achievements={achievements} />;
}
