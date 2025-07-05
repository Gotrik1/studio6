'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { getSession } from '@/features/auth/session';
import { revalidatePath } from 'next/cache';

type CreateMatchData = {
    opponentId: string;
    date: Date;
    time: string;
    venueId: string;
};

export async function createMatch(data: CreateMatchData) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: 'Unauthorized' };
    }

    const userProfileRes = await fetchWithAuth(`/users/${session.user.id}`);
    if (!userProfileRes.success || !userProfileRes.data.teams || userProfileRes.data.teams.length === 0) {
         return { success: false, error: 'Не удалось найти вашу команду. Вы должны быть капитаном или участником команды.' };
    }
    
    // Let's assume the user uses their first team to create a challenge.
    const userTeamId = userProfileRes.data.teams[0].id;

    const [hours, minutes] = data.time.split(':').map(Number);
    const scheduledAt = new Date(data.date);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const payload = {
        team1Id: userTeamId,
        team2Id: data.opponentId,
        scheduledAt,
        playgroundId: data.venueId,
    };

    const result = await fetchWithAuth('/matches', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (result.success) {
        revalidatePath('/matches');
    }

    return result;
}
