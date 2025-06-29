import { managerUser, managerAchievements } from "@/shared/lib/mock-data/manager-profile";
import ManagerClient from "@/app/(app)/administration/manager/client";

export function ManagerProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = managerUser;
    const achievements = managerAchievements;

    return <ManagerClient user={user} achievements={achievements} />;
}
