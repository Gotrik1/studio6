'use client';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

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
        captain: { name: string };
    };
};

export async function getTournamentApplications(tournamentId: string) {
    return fetchWithAuth<Application[]>(`/tournaments/${tournamentId}/applications`, {
        next: { tags: [`applications-${tournamentId}`] }
    });
}

export async function getTournamentParticipants(tournamentId: string) {
    const result = await fetchWithAuth<Participant[]>(`/tournaments/${tournamentId}/participants`, {
        next: { tags: [`participants-${tournamentId}`] }
    });
    
    return result;
}

export async function approveApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth<{teamId: string, team: { slug: string}}>(`/tournaments/${applicationId}/accept`, {
        method: 'PATCH',
    });
    if (result.success) {
        revalidateTag(`applications-${tournamentId}`);
        if(result.data?.team?.slug) {
            revalidateTag(`team-slug-${result.data.team.slug}`);
        }
    }
    return result;
}

export async function rejectApplication(tournamentId: string, applicationId: string) {
    const result = await fetchWithAuth<{teamId: string}>(`/tournaments/${applicationId}/decline`, { method: 'PATCH' });
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
          revalidateTag(`applications-${tournamentId}`);
      }
      return result;
}
