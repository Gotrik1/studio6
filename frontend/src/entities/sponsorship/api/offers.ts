"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { SponsorshipOffer as SponsorshipOfferType } from "../model/types";
import { revalidateTag } from "next/cache";

export type SponsorshipOffer = SponsorshipOfferType;

export async function getSponsorshipOffers(teamId: string) {
  // This assumes an endpoint like GET /teams/{teamId}/sponsorship-offers exists
  const result = await fetchWithAuth<SponsorshipOffer[]>(
    `/sponsorship-offers?teamId=${teamId}`,
    {
      next: { tags: [`sponsorship-offers-${teamId}`] },
    },
  );
  if (!result.success) {
    console.error("Failed to fetch sponsorship offers:", result.error);
    // Silently fail for now
  }
  return result;
}

export async function respondToSponsorshipOffer(
  offerId: string,
  status: "ACCEPTED" | "DECLINED",
) {
  const result = await fetchWithAuth<{ teamId: string }>(
    `/sponsorship-offers/${offerId}/respond`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  if (result.success && result.data) {
    revalidateTag(`sponsorship-offers-${result.data.teamId}`);
  }

  return result;
}
