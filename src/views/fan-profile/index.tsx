
import { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import { teams as mockTeams } from "@/shared/lib/mock-data/teams";
import FanClient from "@/app/(app)/administration/fan/client";

export function FanProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = fanUser;
    const achievements = fanAchievements;
    const favoriteTeams = mockTeams.slice(0, 2);

    return <FanClient user={user} achievements={achievements} favoriteTeams={favoriteTeams} />;
}
