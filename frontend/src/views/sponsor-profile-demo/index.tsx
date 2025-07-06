import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getSponsorById } from "@/entities/sponsor/api/sponsors";
import { notFound } from "next/navigation";

// Demo user ID for a sponsor.
const SPONSOR_ID = 'gfuel'; 

export async function SponsorProfilePage() {
    const sponsorDetails = await getSponsorById(SPONSOR_ID);

    if (!sponsorDetails) {
        notFound();
    }

    const sponsoredTeams = (sponsorDetails.teams || []).map((team: any) => ({
        ...team,
        investment: "50,000 PD", // Mock investment
        since: new Date().toISOString().split("T")[0], // Mock since date
    }));

    return (
        <SponsorClient 
            sponsor={sponsorDetails}
            activeCampaigns={sponsorDetails.promotions || []}
            sponsoredTeams={sponsoredTeams}
        />
    );
}
