import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getPromotions } from "@/entities/promotion/api/promotions";
import { getSponsorshipDashboardData } from "@/entities/sponsorship/api/sponsorship";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";


export default async function SponsorProfileRoute({ params }: { params: { id: string } }) {
    // Fetch all necessary data in parallel
    const [profileData, promotionsData, sponsorshipData, achievements] = await Promise.all([
        getPlayerProfile(params.id),
        getPromotions(),
        getSponsorshipDashboardData(),
        getAchievementsForUser(params.id)
    ]);

    if (!profileData || !profileData.user || profileData.user.role !== 'Спонсор') {
        notFound();
    }
    
    // Filter data relevant to this specific sponsor
    // In a real app, you might have a dedicated endpoint for this
    const activeCampaigns = promotionsData.filter(
        p => p.sponsor?.name === profileData.user.name
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
