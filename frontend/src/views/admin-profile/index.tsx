import AdministratorClient from "@/app/(app)/administration/administrator/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";
import { notFound } from "next/navigation";

const ADMIN_USER_ID = 'admin-001';

export async function AdminProfilePage() {
    const [userData, achievements] = await Promise.all([
        getPlayerProfile(ADMIN_USER_ID),
        getAchievementsForUser(ADMIN_USER_ID)
    ]);
    
    if (!userData) {
        notFound();
    }

    return <AdministratorClient user={userData.user} achievements={achievements} />;
}
