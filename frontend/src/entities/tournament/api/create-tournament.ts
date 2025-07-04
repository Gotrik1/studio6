'use server';

import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function createTournament(tournamentData: any) {
    const result = await fetchWithAuth('/tournaments', {
        method: 'POST',
        body: JSON.stringify(tournamentData),
    });

    if (result.success) {
        revalidatePath('/tournaments');
    }

    return result;
}
