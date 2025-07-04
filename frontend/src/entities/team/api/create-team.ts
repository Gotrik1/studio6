
'use server';
import { revalidatePath } from 'next/cache';

export async function createTeamAction(teamData: {
    name: string;
    motto: string;
    description: string;
    logo: string;
    dataAiHint: string;
    game: string;
    homePlaygroundId: string | null;
    captainId: string;
}) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamData),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Failed to create team' };
        }

        revalidatePath('/teams');
        return { success: true, data: await response.json() };
    } catch (error) {
        console.error('Error creating team:', error);
        return { success: false, error: 'Server error' };
    }
}
