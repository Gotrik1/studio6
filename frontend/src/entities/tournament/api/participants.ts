

'use client';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { User } from '@/shared/lib/types';
import type { Application as AppType, Participant as ParticipantType } from '@/entities/team-application/model/types';

export type Application = AppType;
export type Participant = ParticipantType;

// Local types to avoid direct dependency on backend schemas
type BackendApplication = {
    id: string;
    teamId: string;
    message?: string;
    user: User;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string; } | null;
    }
}
type BackendParticipantTeam = {
    id: string;
    name: string;
    captain: User | null;
    members: User[];
};

function adaptApplication(app: BackendApplication): Application {
    return {
        ...app,
        team: {
            ...app.team,
            captain: app.team.captain,
        },
    };
}
function adaptParticipant(team: BackendParticipantTeam): Participant {
    return {
        ...team,
        captain: team.captain,
        members: team.members.map(m => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            role: m.role
        }))
    }
}


export async function getTournamentApplications(tournamentId: string) {
    const result = await fetchWithAuth<BackendApplication[]>(`/teams/${tournamentId}/applications`, {
        next: { tags: [`team-applications-${tournamentId}`] }
    });
    
    if (result.success && Array.isArray(result.data)) {
        return {
            ...result,
            data: result.data.map(adaptApplication)
        }
    }
    return result;
}

export async function getTournamentParticipants(tournamentId: string) {
    const result = await fetchWithAuth<BackendParticipantTeam[]>(`/tournaments/${tournamentId}/participants`, {
        next: { tags: [`participants-${tournamentId}`] }
    });
    
     if (result.success && Array.isArray(result.data)) {
        return {
            ...result,
            data: result.data.map(adaptParticipant)
        }
    }
    return result;
}

export async function approveApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth<{teamId: string, team: { slug: string}}>(`/team-applications/${applicationId}/accept`, { method: 'PATCH' });
    if (result.success) {
        revalidateTag(`team-applications-${tournamentId}`);
        // Also revalidate team details to update roster
        revalidateTag(`team-slug-${result.data.team.slug}`);
    }
    return result;
}

export async function rejectApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth<{teamId: string}>(`/team-applications/${applicationId}/decline`, { method: 'PATCH' });
     if (result.success) {
        revalidateTag(`team-applications-${result.data.teamId}`);
    }
    return result;
}

export async function removeParticipant(tournamentId: string, teamId: string) {
      const result = await fetchWithAuth(`/tournaments/${tournamentId}/participants/${teamId}`, {
          method: 'DELETE',
      });
      if (result.success) {
          revalidateTag(`participants-${tournamentId}`);
          revalidateTag(`team-applications-${tournamentId}`);
      }
      return result;
}
