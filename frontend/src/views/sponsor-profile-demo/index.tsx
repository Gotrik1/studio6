

import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getPromotions } from "@/entities/promotion/api/promotions";
import { getSponsorshipDashboardData } from "@/entities/sponsorship/api/sponsorship";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";


// Demo user ID for a sponsor.
const SPONSOR_USER_ID = '9'; // This user should exist in the seed with role "Спонсор"

export async function SponsorProfilePage() {
    // Fetch all necessary data in parallel
    const [profileData, promotionsData, sponsorshipData, achievements] = await Promise.all([
        getPlayerProfile(SPONSOR_USER_ID),
        getPromotions(),
        getSponsorshipDashboardData(),
        getAchievementsForUser(SPONSOR_USER_ID)
    ]);

    if (!profileData || !profileData.user || profileData.user.role !== 'Спонсор') {
        notFound();
    }
    
    // Filter data relevant to this specific sponsor for the demo
    // In a real app, you might have a dedicated endpoint for this
    const activeCampaigns = promotionsData.filter(
        (p) => p.sponsor?.name === profileData.user.name
    );
    
    const sponsoredTeams = sponsorshipData?.sponsoredTeams || [];

    return (
        <SponsorClient 
            user={profileData.user} 
            achievements={achievements}
            activeCampaigns={activeCampaigns}
            sponsoredTeams={sponsoredTeams}
        />
    );
}
