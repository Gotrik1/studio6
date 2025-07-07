

'use client';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { Team, User as PrismaUser } from '@prisma/client';

type BackendUser = PrismaUser;
type BackendTeam = Team & { captain: BackendUser; members: BackendUser[] };
type ApplicationTeam = {
    id: string;
    name: string;
    captain: { name: string; };
};
export type Application = {
    id: string;
    team: ApplicationTeam;
};

// Adapter to transform a raw team object from the backend
const adaptParticipantTeam = (team: BackendTeam) => {
    if (!team) return null;
    return {
        ...team,
        id: String(team.id),
        captain: team.captain ? { ...team.captain, id: String(team.captain.id) } : null,
        members: (team.members || []).map((member: BackendUser) => ({
            ...member,
            id: String(member.id),
            avatar: member.avatar || null,
        })),
    };
};

export async function getTournamentApplications(tournamentId: string) {
    const result = await fetchWithAuth<Application[]>(`/tournaments/${tournamentId}/applications`, {
        next: { tags: [`applications-${tournamentId}`] }
    });
    return result;
}

export async function getTournamentParticipants(tournamentId: string) {
    const result = await fetchWithAuth<Participant[]>(`/tournaments/${tournamentId}/participants`, {
        next: { tags: [`participants-${tournamentId}`] }
    });

    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map(adaptParticipantTeam as (team: BackendTeam) => Participant).filter(p => p);
    }
    
    return result;
}

export async function approveApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'APPROVED' }),
    });
    if (result.success) {
        revalidateTag(`applications-${tournamentId}`);
        revalidateTag(`participants-${tournamentId}`);
    }
    return result;
}

export async function rejectApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/applications/${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'REJECTED' }),
    });
     if (result.success) {
        revalidateTag(`applications-${tournamentId}`);
    }
    return result;
}

export async function removeParticipant(tournamentId: string, teamId: string) {
      const result = await fetchWithAuth(`/tournaments/${tournamentId}/participants/${teamId}`, {
          method: 'DELETE',
      });
      if (result.success) {
          revalidateTag(`participants-${tournamentId}`);
          // Optionally, revalidate applications if removing a team makes them eligible again
          revalidateTag(`applications-${tournamentId}`);
      }
      return result;
}


// Types for frontend usage, can be moved to a model/types file
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