"use server";

import type { Sponsor } from "@/entities/sponsor/model/types";
import type { SponsoredTeam } from "@/entities/sponsorship/model/types";
import type { Promotion } from "@/entities/promotion/model/types";

export async function getSponsors(): Promise<Sponsor[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sponsors`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch sponsors");
  }
  return res.json();
}

export type SponsorDetails = Sponsor & {
  promotions: Promotion[];
  teams: SponsoredTeam[];
};

export async function getSponsorById(
  id: string,
): Promise<SponsorDetails | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sponsors/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    console.error(`Failed to fetch sponsor ${id}:`, res.statusText);
    return null;
  }
  return res.json();
}
