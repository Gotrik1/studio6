'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/features/auth/session';

export async function createTournament(tournamentData: any) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/tournaments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(tournamentData),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Failed to create tournament' };
        }

        revalidatePath('/tournaments');
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error creating tournament:', error);
        return { success: false, error: 'Server error' };
    }
}
