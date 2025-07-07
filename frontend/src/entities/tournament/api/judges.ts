

'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { User } from '@/shared/lib/types';


// Assuming the backend returns a user object compatible with this structure.
type BackendJudge = User;

// Adapter function to map backend judge data to frontend User type
const mapBackendJudgeToFrontendUser = (backendJudge: BackendJudge): User => {
    return {
        id: String(backendJudge.id), // Ensure ID is a string
        name: backendJudge.name,
        avatar: backendJudge.avatar || null,
        email: backendJudge.email,
        role: backendJudge.role,
        status: backendJudge.status || 'Активен',
    };
};

export async function getAssignedJudges(tournamentId: string): Promise<User[]> {
    const result = await fetchWithAuth<BackendJudge[]>(`/tournaments/${tournamentId}/judges`);
    if (result.success && Array.isArray(result.data)) {
        return result.data.map(mapBackendJudgeToFrontendUser);
    }
    return [];
}

export async function getAvailableJudges(): Promise<User[]> {
    const result = await fetchWithAuth<BackendJudge[]>('/users?role=JUDGE');
    // Assuming /users endpoint already returns the correct User shape, but we can map just in case.
    if (result.success && Array.isArray(result.data)) {
         return result.data.map(mapBackendJudgeToFrontendUser);
    }
    return [];
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
