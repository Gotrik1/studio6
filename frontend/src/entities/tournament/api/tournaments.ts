

'use server';

import { revalidatePath } from 'next/cache';
import { fetchWithAuth } from '@/shared/lib/api-client';

export type CreateTournamentDto = {
  name: string;
  game: string;
  description?: string;
  type: 'team' | 'individual';
  format: 'single_elimination' | 'round_robin' | 'groups';
  category: string;
  location: string;
  participantCount: number;
  registrationStartDate: Date;
  registrationEndDate: Date;
  tournamentStartDate: Date;
  prizePool?: string;
  rules?: string;
  bannerImage?: string;
  bannerImageHint?: string;
};

// Define a type for updating, which can have partial data
export type UpdateTournamentDto = Partial<Omit<CreateTournamentDto, 'bannerImage' | 'bannerImageHint'>>;

export async function createTournament(tournamentData: CreateTournamentDto) {
    const result = await fetchWithAuth('/tournaments', {
        method: 'POST',
        body: JSON.stringify(tournamentData),
    });

    if (result.success) {
        revalidatePath('/tournaments');
        revalidatePath('/administration/tournament-crm/dashboard');
    }

    return result;
}


export async function updateTournament(id: string, tournamentData: UpdateTournamentDto) {
    const result = await fetchWithAuth(`/tournaments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(tournamentData),
    });

    if (result.success) {
        revalidatePath(`/administration/tournament-crm/${id}`);
        revalidatePath('/administration/tournament-crm/dashboard');
    }

    return result;
}
