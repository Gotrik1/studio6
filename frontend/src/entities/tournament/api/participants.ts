

'use client';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { User as FrontendUser } from '@/shared/lib/types';
import type { Team, User } from '@prisma/client';

type BackendUser = User;
type BackendTeam = Team & { captain: BackendUser; members: BackendUser[] };
type BackendApplication = { id: string; team: BackendTeam };

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
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/applications`, {
        next: { tags: [`applications-${tournamentId}`] }
    });
    
    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map((app: BackendApplication) => ({
            ...app,
            id: String(app.id),
            team: adaptParticipantTeam(app.team),
        }));
    }

    return result;
}

export async function getTournamentParticipants(tournamentId: string) {
    const result = await fetchWithAuth(`/tournaments/${tournamentId}/participants`, {
        next: { tags: [`participants-${tournamentId}`] }
    });

    if (result.success && Array.isArray(result.data)) {
        result.data = result.data.map(adaptParticipantTeam);
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
