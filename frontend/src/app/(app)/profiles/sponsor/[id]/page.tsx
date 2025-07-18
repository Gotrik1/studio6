"use client";

import SponsorClient from "@/app/(app)/administration/sponsor/client";
import {
  getSponsorById,
  type SponsorDetails,
} from "@/entities/sponsor/api/sponsors";
import { notFound } from "next/navigation";
import type { SponsoredTeam } from "@/entities/sponsorship/model/types";
import { useEffect, useState, use } from "react";
import type { Team } from "@/entities/team/model/types";

export default function SponsorProfileRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = use(props.params);
  const [sponsorDetails, setSponsorDetails] = useState<SponsorDetails | null>(
    null,
  );

  useEffect(() => {
    getSponsorById(params.id).then(setSponsorDetails);
  }, [params.id]);

  if (!sponsorDetails) {
    return notFound();
  }

  // The backend for sponsor returns a list of Team objects, not SponsoredTeam.
  // We must adapt the data here to match what the component expects.
  const sponsoredTeams: SponsoredTeam[] = (sponsorDetails.teams || []).map(
    (team: Team) => ({
      ...team,
      logo: team.logo || "https://placehold.co/100x100.png",
      logoHint: team.dataAiHint || "team logo",
      investment: "50,000 PD", // Mock investment
      since: new Date().toISOString().split("T")[0], // Mock since date
    }),
  );

  return (
    <SponsorClient
      sponsor={sponsorDetails}
      activeCampaigns={sponsorDetails.promotions || []}
      sponsoredTeams={sponsoredTeams}
    />
  );
}
