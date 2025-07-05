
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

// Adapter to transform a raw sponsor object from the backend
const adaptSponsor = (sponsor: any) => {
    if (!sponsor) return null;
    return {
        ...sponsor,
        id: String(sponsor.id),
        logo: sponsor.logoUrl || sponsor.logo || 'https://placehold.co/100x100.png',
        logoHint: sponsor.logoHint || 'sponsor logo',
    };
};

export async function getAssignedSponsors(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors`);
    
    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map(adaptSponsor);
    }

    return result;
}

export async function getAvailableSponsors() {
    const result = await fetchWithAuth('/sponsors');

    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map(adaptSponsor);
    }

    return result;
}

export async function assignSponsor(tournamentId: string, sponsorId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors`, {
        method: 'POST',
        body: JSON.stringify({ sponsorId }),
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
