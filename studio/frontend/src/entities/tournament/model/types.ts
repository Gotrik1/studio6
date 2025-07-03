
import type { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';
import type { allTournaments } from '@/shared/lib/mock-data/tournaments';

export type TournamentDetails = typeof summerKickoffTournament;
export type Tournament = (typeof allTournaments)[0];
