'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getAssignedMedicalStaff(tournamentId: string) {
    return fetchWithAuth(`/tournaments/${tournamentId}/medical`);
}

export async function getAvailableMedicalPartners() {
    return fetchWithAuth('/medical-partners');
}

export async function assignMedicalPartner(tournamentId: string, partnerId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/medical`, {
        method: 'POST',
        body: JSON.stringify({ partnerId }),
    });
    if (result.success) {
        revalidateTag(`medical-${tournamentId}`);
    }
    return result;
}

export async function unassignMedicalPartner(tournamentId: string, partnerId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/medical/${partnerId}`, {
        method: 'DELETE',
    });
    if (result.success) {
        revalidateTag(`medical-${tournamentId}`);
    }
    return result;
}
