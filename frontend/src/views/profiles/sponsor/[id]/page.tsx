

'use client';

import SponsorClient from "@/app/(app)/administration/sponsor/client";
import { getSponsorById } from "@/entities/sponsor/api/sponsors";
import { notFound } from "next/navigation";
import type { SponsoredTeam } from "@/entities/sponsorship/model/types";
import { useEffect, useState } from "react";
import type { SponsorDetails } from "@/entities/sponsor/api/sponsors";
import type { Team } from "@/entities/team/model/types";


export default function SponsorProfileRoute({ params }: { params: { id: string } }) {
    const [sponsorDetails, setSponsorDetails] = useState<SponsorDetails | null>(null);

    useEffect(() => {
        getSponsorById(params.id).then(setSponsorDetails);
    }, [params.id]);

    if (!sponsorDetails) {
        return notFound();
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
