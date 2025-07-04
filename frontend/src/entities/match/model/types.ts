
import type { matchData } from "@/shared/lib/mock-data/match-details";
import type { matchesList } from "@/shared/lib/mock-data/matches";

export type MatchDetails = typeof matchData;
export type Match = (typeof matchesList)[0] & { playgroundId?: string | null };
