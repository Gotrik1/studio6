

'use client';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { User as PrismaUser } from '@prisma/client';

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
    captain: { name: string; };
    members: RosterMember[];
};
export type Application = {
    id: string;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string };
    };
};

type BackendApplication = {
    id: string;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: PrismaUser | null
    }
}
type BackendParticipantTeam = {
    id: string;
    name: string;
    captain: PrismaUser | null;
    members: PrismaUser[];
};

function adaptApplication(app: BackendApplication): Application {
    return {
        id: app.id,
        team: {
            id: app.team.id,
            name: app.team.name,
            slug: app.team.slug,
            captain: { name: app.team.captain?.name || 'N/A' },
        },
    };
}
function adaptParticipant(team: BackendParticipantTeam): Participant {
    return {
        id: team.id,
        name: team.name,
        captain: { name: team.captain?.name || 'N/A' },
        members: team.members.map(m => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            role: m.role
        }))
    }
}


export async function getTournamentApplications(tournamentId: string) {
    const result = await fetchWithAuth<BackendApplication[]>(`/tournaments/${tournamentId}/applications`, {
        next: { tags: [`applications-${tournamentId}`] }
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
    const result = await fetchWithAuth<{teamId: string, team: { slug: string}}>(`/team-applications/${applicationId}/accept`, {
        method: 'PATCH',
    });
    if (result.success && result.data?.team?.slug) {
        revalidateTag(`applications-${tournamentId}`);
        revalidateTag(`team-slug-${result.data.team.slug}`);
    }
    return result;
}

export async function rejectApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth<{teamId: string}>(`/team-applications/${applicationId}/decline`, { method: 'PATCH' });
     if (result.success && result.data) {
        revalidateTag(`applications-${result.data.teamId}`);
    }
    return result;
}

export async function removeParticipant(tournamentId: string, teamId: string) {
      const result = await fetchWithAuth(`/tournaments/${tournamentId}/participants/${teamId}`, {
          method: 'DELETE',
      });
      if (result.success) {
          revalidateTag(`participants-${tournamentId}`);
          revalidateTag(`applications-${tournamentId}`);
      }
      return result;
}
