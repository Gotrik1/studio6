
import { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import FanClient from "@/app/(app)/administration/fan/client";

export function FanProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = fanUser;
    const achievements = fanAchievements;

    return <FanClient user={user} achievements={achievements} />;
}
