
import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getSponsorById, type SponsorDetails } from "@/entities/sponsor/api/sponsors";
import { notFound } from "next/navigation";
import type { SponsoredTeam } from "@/entities/sponsorship/model/types";
import type { Team } from "@/entities/team/model/types";

// Demo user ID for a sponsor.
const SPONSOR_ID = 'gfuel'; 

export async function SponsorProfilePage() {
    const sponsorDetails = await getSponsorById(SPONSOR_ID);

    if (!sponsorDetails) {
        notFound();
    }

    const sponsoredTeams: SponsoredTeam[] = (sponsorDetails.teams || []).map((team: Team) => ({
        ...team,
        logo: team.logo || 'https://placehold.co/100x100.png',
        logoHint: team.dataAiHint || 'team logo',
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
