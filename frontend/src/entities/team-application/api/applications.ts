
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getTeamApplications(teamId: string) {
    return fetchWithAuth(`/teams/${teamId}/applications`, {
        next: { tags: [`team-applications-${teamId}`] }
    });
}

export async function createTeamApplication(teamId: string, message: string) {
     const result = await fetchWithAuth('/team-applications', {
        method: 'POST',
        body: JSON.stringify({ teamId, message }),
    });
    if(result.success) {
        revalidateTag(`team-applications-${teamId}`);
    }
    return result;
}

export async function acceptTeamApplication(applicationId: string) {
    const result = await fetchWithAuth<{teamId: string, team: { slug: string}}>(`/team-applications/${applicationId}/accept`, { method: 'PATCH' });
    if (result.success) {
        revalidateTag(`team-applications-${result.data.teamId}`);
        // Also revalidate team details to update roster
        revalidateTag(`team-slug-${result.data.team.slug}`);
    }
    return result;
}

export async function declineTeamApplication(applicationId: string) {
    const result = await fetchWithAuth<{teamId: string}>(`/team-applications/${applicationId}/decline`, { method: 'PATCH' });
     if (result.success) {
        revalidateTag(`team-applications-${result.data.teamId}`);
    }
    return result;
}
