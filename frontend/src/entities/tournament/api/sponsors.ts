'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getAssignedSponsors(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/sponsors`);
    return result;
}

export async function getAvailableSponsors() {
    const result = await fetchWithAuth('/sponsors');
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
