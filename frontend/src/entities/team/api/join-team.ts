'use server';

import { getSession } from "@/features/auth/session";
import { revalidatePath } from "next/cache";

export async function joinTeamAction(teamId: string, teamSlug: string) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/teams/${teamId}/join`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id }),
        });

        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Failed to join team' };
        }
        
        revalidatePath(`/teams/${teamSlug}`);

        return { success: true };
    } catch (error) {
        console.error('Error joining team:', error);
        return { success: false, error: 'Server error' };
    }
}
