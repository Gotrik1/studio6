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
        revalidatePath('/administration/tournament-crm/dashboard');
    }

    return result;
}


export async function updateTournament(id: string, tournamentData: any) {
    const result = await fetchWithAuth(`/tournaments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(tournamentData),
    });

    if (result.success) {
        revalidatePath(`/administration/tournament-crm/${id}`);
        revalidatePath('/administration/tournament-crm/dashboard');
    }

    return result;
}
