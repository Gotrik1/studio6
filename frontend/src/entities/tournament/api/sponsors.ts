"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";
import { revalidateTag } from "next/cache";
import type { Sponsor as SponsorType } from "@/entities/sponsor/model/types";

// Local type definition to avoid direct Prisma dependency
type BackendSponsor = {
  id: string;
  name: string;
  logo: string | null;
  logoHint: string | null;
  description: string;
  profileUrl: string;
  interests: string[];
  amount?: number;
};

// Adapter to transform a raw sponsor object from the backend
const adaptSponsor = (
  sponsor: BackendSponsor | null | undefined,
): (SponsorType & { amount?: number }) | null => {
  if (!sponsor) return null;
  return {
    ...sponsor,
    id: String(sponsor.id),
    logo: sponsor.logo || "https://placehold.co/100x100.png",
    logoHint: sponsor.logoHint || "sponsor logo",
    // Now expecting amount from the backend
    amount: sponsor.amount || 0,
  };
};

export async function getAssignedSponsors(
  tournamentId: string,
): Promise<(SponsorType & { amount: number })[]> {
  const result = await fetchWithAuth<BackendSponsor[]>(
    `/tournaments/${tournamentId}/sponsors`,
    { next: { tags: [`sponsors-${tournamentId}`] } },
  );

  if (result.success && Array.isArray(result.data)) {
    return result.data.map(adaptSponsor).filter(Boolean) as (SponsorType & {
      amount: number;
    })[];
  }

  return [];
}

export async function getAvailableSponsors() {
  const result = await fetchWithAuth<BackendSponsor[]>("/sponsors");

  if (result.success && Array.isArray(result.data)) {
    const adaptedData = result.data
      .map(adaptSponsor)
      .filter(Boolean) as SponsorType[];
    return { ...result, data: adaptedData };
  }

  return result;
}

export async function assignSponsor(
  tournamentId: string,
  sponsorId: string,
  amount: number,
) {
  const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors`, {
    method: "POST",
    body: JSON.stringify({ sponsorId, amount }),
  });
  if (result.success) {
    revalidateTag(`sponsors-${tournamentId}`);
  }
  return result;
}

export async function unassignSponsor(tournamentId: string, sponsorId: string) {
  const result = await fetchWithAuth(
    `/tournaments/${tournamentId}/sponsors/${sponsorId}`,
    {
      method: "DELETE",
    },
  );
  if (result.success) {
    revalidateTag(`sponsors-${tournamentId}`);
  }
  return result;
}
