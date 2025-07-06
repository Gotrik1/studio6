
import { getPlayerProfile } from "@/entities/user/api/get-user";
import ManagerClient from "@/app/(app)/administration/manager/client";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";

const DEMO_MANAGER_ID = '5'; // Иван Сидоров

export async function ManagerProfilePage() {
    const [userData, achievements] = await Promise.all([
        getPlayerProfile(DEMO_MANAGER_ID),
        getAchievementsForUser(DEMO_MANAGER_ID)
    ]);
    
    if (!userData) {
        notFound();
    }

    return <ManagerClient user={userData.user} achievements={achievements} />;
}
