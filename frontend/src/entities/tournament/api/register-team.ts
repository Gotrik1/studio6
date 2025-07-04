'use server';

import { getSession } from "@/features/auth/session";
import { revalidatePath } from "next/cache";
import type { UserTeam } from '@/entities/user/model/types';

export async function registerTeamForTournamentAction(tournamentId: string, tournamentSlug: string) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Fetch user's teams
        const teamsResponse = await fetch(`${process.env.BACKEND_URL}/users/${session.user.id}/teams`, {
             headers: { 'Authorization': `Bearer ${session.access_token}` },
             cache: 'no-store'
        });

        if (!teamsResponse.ok) {
             const error = await teamsResponse.json();
             return { success: false, error: error.message || "Не удалось получить список ваших команд." };
        }
        const userTeams: UserTeam[] = await teamsResponse.json();
        
        if (!userTeams || userTeams.length === 0) {
            return { success: false, error: "У вас нет команды для регистрации. Сначала создайте или вступите в команду." };
        }
        
        // 2. For simplicity, register the first team
        const teamToRegister = userTeams[0];

        // 3. Call the registration endpoint
        const registerResponse = await fetch(`${process.env.BACKEND_URL}/tournaments/${tournamentId}/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teamId: teamToRegister.id }),
        });

        if (!registerResponse.ok) {
            const error = await registerResponse.json();
            return { success: false, error: error.message || 'Failed to register team' };
        }
        
        revalidatePath(`/tournaments/${tournamentSlug}`);
        return { success: true };

    } catch (error: any) {
        console.error('Error registering team:', error);
        return { success: false, error: error.message || 'Server error' };
    }
}
