

'use client';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { User } from '@/shared/lib/types';

// Frontend-specific types
export type RosterMember = {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
};
export type Participant = {
    id: string;
    name: string;
    captain: { name: string; } | null;
    members: RosterMember[];
};
export type Application = {
    id: string;
    teamId: string;
    message?: string;
    user: User;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string; } | null;
    };
};

type BackendApplication = {
    id: string;
    teamId: string;
    message?: string;
    user: User;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string } | null;
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
        id: app.id,
        teamId: app.teamId,
        message: app.message,
        user: app.user,
        team: {
            id: app.team.id,
            name: app.team.name,
            slug: app.team.slug,
            captain: app.team.captain,
        },
    };
}
function adaptParticipant(team: BackendParticipantTeam): Participant {
    return {
        id: team.id,
        name: team.name,
        captain: team.captain ? { name: team.captain.name } : null,
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
    if (result.success && result.data?.team?.slug) {
        revalidateTag(`team-applications-${tournamentId}`);
        revalidateTag(`team-slug-${result.data.team.slug}`);
    }
    return result;
}

export async function rejectApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth<{teamId: string}>(`/team-applications/${applicationId}/decline`, { method: 'PATCH' });
     if (result.success && result.data) {
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
