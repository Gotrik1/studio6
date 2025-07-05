'use server';

import type { Team } from '@/entities/team/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidatePath } from 'next/cache';

export async function getTeams(): Promise<Team[]> {
  const result = await fetchWithAuth('/teams');
  if (!result.success) {
    console.error('Failed to fetch teams from backend:', result.error);
    return []; // Return empty array on failure
  }
  return result.data;
}

export async function setHomePlayground(teamId: string, playgroundId: string) {
    const result = await fetchWithAuth(`/teams/${teamId}/home-playground`, {
        method: 'PATCH',
        body: JSON.stringify({ playgroundId }),
    });

    if (result.success) {
        // Revalidate the team page to show the new home playground
        revalidatePath(`/teams/${result.data.slug}`);
    }

    return result;
}

export async function removeMember(teamId: string, memberId: string) {
    return fetchWithAuth(`/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
    });
}

export async function setCaptain(teamId: string, newCaptainId: string) {
    return fetchWithAuth(`/teams/${teamId}/captain`, {
        method: 'PATCH',
        body: JSON.stringify({ newCaptainId }),
    });
}
