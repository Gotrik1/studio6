'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getAssignedJudges(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/judges`);
    return result.success ? result.data : [];
}

export async function getAvailableJudges() {
    const result = await fetchWithAuth('/users?role=Судья');
    return result.success ? result.data : [];
}

export async function assignJudge(tournamentId: string, judgeId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/judges`, {
        method: 'POST',
        body: JSON.stringify({ judgeId }),
    });
    if (result.success) {
        revalidateTag(`judges-${tournamentId}`);
    }
    return result;
}

export async function unassignJudge(tournamentId: string, judgeId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/judges/${judgeId}`, {
        method: 'DELETE',
    });
    if (result.success) {
        revalidateTag(`judges-${tournamentId}`);
    }
    return result;
}
