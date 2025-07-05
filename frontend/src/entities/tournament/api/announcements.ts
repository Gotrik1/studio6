'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getAnnouncements(tournamentId: string) {
    return fetchWithAuth(`/tournaments/${tournamentId}/announcements`, { next: { tags: [`announcements-${tournamentId}`] } });
}

export async function createAnnouncement(tournamentId: string, data: {subject: string, message: string}) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/announcements`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    
    if (result.success) {
        revalidateTag(`announcements-${tournamentId}`);
    }
    
    return result;
}
