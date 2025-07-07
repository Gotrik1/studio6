

'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidatePath } from 'next/cache';
import type { Match as PrismaMatch } from '@prisma/client';

type ResolveDisputePayload = {
  winnerId: string;
  resolution: string;
  score1: number;
  score2: number;
};

export async function resolveDispute(matchId: string, payload: ResolveDisputePayload) {
  const result = await fetchWithAuth<PrismaMatch>(`/matches/${matchId}/resolve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.success && result.data) {
    revalidatePath('/judge-center');
    revalidatePath(`/administration/tournament-crm/${result.data.tournamentId}`);
  }

  return result;
}
