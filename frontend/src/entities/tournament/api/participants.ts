'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getTournamentApplications(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/applications`, {
        next: { tags: [`applications-${tournamentId}`] }
    });
    return result;
}

export async function getTournamentParticipants(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/participants`, {
        next: { tags: [`participants-${tournamentId}`] }
    });
    return result;
}

export async function approveApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'APPROVED' }),
    });
    if (result.success) {
        revalidateTag(`applications-${tournamentId}`);
        revalidateTag(`participants-${tournamentId}`);
    }
    return result;
}

export async function rejectApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'REJECTED' }),
    });
    if (result.success) {
        revalidateTag(`applications-${tournamentId}`);
    }
    return result;
}

export async function removeParticipant(tournamentId: string, teamId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/participants/${teamId}`, {
        method: 'DELETE',
    });
    if (result.success) {
        revalidateTag(`participants-${tournamentId}`);
        // Optionally, revalidate applications if removing a team makes them eligible again
        revalidateTag(`applications-${tournamentId}`);
    }
    return result;
}
