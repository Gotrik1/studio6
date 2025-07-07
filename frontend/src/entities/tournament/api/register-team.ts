

'use server';

import { getSession } from "@/features/auth/session";
import { revalidatePath } from "next/cache";
import type { UserTeam as UserTeamType } from '@/entities/team/model/types';
import { fetchWithAuth } from "@/shared/lib/api-client";
import type { FullUserProfile } from '@/entities/user/model/types';


export async function registerTeamForTournamentAction(tournamentId: string, tournamentSlug: string) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const profileResult = await fetchWithAuth<FullUserProfile>(`/users/${session.user.id}`);
        
        if(!profileResult.success) {
             return { success: false, error: profileResult.error || "Не удалось получить список ваших команд." };
        }
        
        const userTeams: UserTeamType[] = profileResult.data.teams || [];
        
        if (!userTeams || userTeams.length === 0) {
            return { success: false, error: "У вас нет команды для регистрации. Сначала создайте или вступите в команду." };
        }
        
        // For simplicity, register the first team
        const teamToRegister = userTeams[0];

        const registerResult = await fetchWithAuth(`/tournaments/${tournamentId}/register`, {
            method: 'POST',
            body: JSON.stringify({ teamId: teamToRegister.id }),
        });

        if (!registerResult.success) {
            return { success: false, error: (registerResult.error) || 'Failed to register team' };
        }
        
        revalidatePath(`/tournaments/${tournamentSlug}`);
        return { success: true, data: registerResult.data };

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        console.error('Error registering team:', error);
        return { success: false, error: message };
    }
}
