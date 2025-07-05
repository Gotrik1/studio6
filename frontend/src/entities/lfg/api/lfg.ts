'use server';

import type { LfgLobby } from '@/entities/lfg/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidatePath } from 'next/cache';

export async function fetchLobbies(): Promise<LfgLobby[]> {
    const result = await fetchWithAuth('/lfg');
    if (!result.success) {
        console.error('Failed to fetch lobbies:', result.error);
        return [];
    }
    // Prisma returns Date objects as strings, need to convert them back
    return result.data.map((lobby: any) => ({
        ...lobby,
        startTime: new Date(lobby.startTime),
        endTime: new Date(lobby.endTime),
    }));
}

export async function createLobby(data: any) {
    const result = await fetchWithAuth('/lfg', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if(result.success) {
        revalidatePath('/lfg');
    }
    return result;
}

export async function joinLobby(lobbyId: string) {
    const result = await fetchWithAuth(`/lfg/${lobbyId}/join`, {
        method: 'POST',
    });
    if(result.success) {
        revalidatePath('/lfg');
    }
    return result;
}
