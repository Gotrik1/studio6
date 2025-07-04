import { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import { teams as mockTeams } from "@/shared/lib/mock-data/teams";
import FanClient from "@/app/(app)/administration/fan/client";
import { useSession } from "@/shared/lib/session/client";

export function FanProfilePage() {
    const { user: sessionUser } = useSession();
    // In a real application, this data would be fetched from an API
    const user = fanUser;
    const achievements = fanAchievements;
    const favoriteTeams = mockTeams.slice(0, 2);
    const isCurrentUser = sessionUser?.id === user.id;

    return <FanClient user={user} achievements={achievements} favoriteTeams={favoriteTeams} isCurrentUser={isCurrentUser} />;
}
