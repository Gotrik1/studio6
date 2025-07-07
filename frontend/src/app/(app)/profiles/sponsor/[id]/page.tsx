
import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getSponsorById } from "@/entities/sponsor/api/sponsors";
import { notFound } from "next/navigation";
import type { SponsoredTeam } from "@/entities/sponsorship/model/types";


export default async function SponsorProfileRoute({ params }: { params: { id: string } }) {
    const sponsorDetails = await getSponsorById(params.id);

    if (!sponsorDetails) {
        notFound();
    }
    
    const sponsoredTeams: SponsoredTeam[] = (sponsorDetails.teams || []).map((team: { slug: string; name: string; logo: string; dataAiHint: string; }) => ({
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
