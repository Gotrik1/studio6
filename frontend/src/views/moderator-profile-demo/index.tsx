
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";
import ModeratorClient from "@/app/(app)/administration/moderator/client";
import { notFound } from "next/navigation";

const DEMO_MODERATOR_ID = '8'; // Елена 'Varya' Волкова

export async function ModeratorProfilePage() {
    const [userData, achievements] = await Promise.all([
        getPlayerProfile(DEMO_MODERATOR_ID),
        getAchievementsForUser(DEMO_MODERATOR_ID)
    ]);

    if (!userData) {
        notFound();
    }

    return <ModeratorClient user={userData.user} achievements={achievements} />;
}
