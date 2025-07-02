import { adminUser, adminAchievements } from "@/shared/lib/mock-data/admin-profile";
import AdministratorClient from "@/app/(app)/administration/administrator/client";

export function AdminProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = adminUser;
    const achievements = adminAchievements;

    return <AdministratorClient user={user} achievements={achievements} />;
}
