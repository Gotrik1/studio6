export interface MatchFinishedPayload {
  matchId: string;
  team1Name: string;
  team2Name: string;
  score1: number;
  score2: number;
  participantIds: string[];
}
