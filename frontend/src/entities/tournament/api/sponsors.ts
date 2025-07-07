

'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { Sponsor } from '@/entities/sponsor/model/types';
import type { Sponsor as PrismaSponsor } from '@prisma/client';

type BackendSponsor = PrismaSponsor & { amount?: number };

// Adapter to transform a raw sponsor object from the backend
const adaptSponsor = (sponsor: BackendSponsor | null | undefined): (Sponsor & { amount?: number }) | null => {
    if (!sponsor) return null;
    return {
        ...sponsor,
        id: String(sponsor.id),
        logo: sponsor.logo || 'https://placehold.co/100x100.png',
        logoHint: sponsor.logoHint || 'sponsor logo',
        // Now expecting amount from the backend
        amount: sponsor.amount || 0,
    };
};

export async function getAssignedSponsors(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors`, { next: { tags: [`sponsors-${tournamentId}`] } });
    
    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map(adaptSponsor).filter(Boolean);
    }

    return result;
}

export async function getAvailableSponsors() {
    const result = await fetchWithAuth('/sponsors');

    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map(adaptSponsor).filter(Boolean);
    }

    return result;
}

export async function assignSponsor(tournamentId: string, sponsorId: string, amount: number) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors`, {
        method: 'POST',
        body: JSON.stringify({ sponsorId, amount }),
    });
    if (result.success) {
        revalidateTag(`sponsors-${tournamentId}`);
    }
    return result;
}

export async function unassignSponsor(tournamentId: string, sponsorId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors/${sponsorId}`, {
        method: 'DELETE',
    });
    if (result.success) {
        revalidateTag(`sponsors-${tournamentId}`);
    }
    return result;
}
