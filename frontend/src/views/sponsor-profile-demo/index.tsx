import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getPromotions, type Promotion } from "@/entities/promotion/api/promotions";
import { getSponsorshipDashboardData, type SponsoredTeam } from "@/entities/sponsorship/api/sponsorship";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { achievements } from "@/shared/lib/mock-data/profiles";

// Demo user ID for a sponsor.
const SPONSOR_USER_ID = '9'; // This user should exist in the seed with role "Спонсор"

export async function SponsorProfilePage() {
    // Fetch all necessary data in parallel
    const [profileData, promotionsData, sponsorshipData] = await Promise.all([
        getPlayerProfile(SPONSOR_USER_ID),
        getPromotions(),
        getSponsorshipDashboardData()
    ]);

    if (!profileData || !profileData.user) {
        notFound();
    }
    
    // Filter data relevant to this specific sponsor for the demo
    const activeCampaigns = promotionsData.filter(
        p => p.sponsor?.name === profileData.user.name
    );
    
    const sponsoredTeams = sponsorshipData?.sponsoredTeams || [];

    return (
        <SponsorClient 
            user={profileData.user} 
            achievements={achievements} // achievements are still mock-based
            activeCampaigns={activeCampaigns}
            sponsoredTeams={sponsoredTeams}
        />
    );
}
