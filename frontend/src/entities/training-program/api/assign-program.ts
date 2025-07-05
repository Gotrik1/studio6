'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export async function assignTrainingProgram(programId: string, playerIds: string[]) {
    const result = await fetchWithAuth('/training/programs/assign', {
        method: 'POST',
        body: JSON.stringify({ programId, playerIds }),
    });

    // Revalidation is not strictly necessary here, as this action doesn't
    // change any data that is immediately displayed on the client after assignment.
    // The result of assignment is usually seen in other parts of the app,
    // like the player's training log, which would be fetched separately.
    
    return result;
}
