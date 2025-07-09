import { getTeamLeaderboard } from "@/entities/team/api/get-leaderboard";
import { getPlayerLeaderboard } from "@/entities/leaderboard/api/get-player-leaderboard";
import LeaderboardsClient from "@/app/(app)/leaderboards/client";

export async function LeaderboardsPage() {
  const [teamLeaderboard, playerLeaderboard] = await Promise.all([
    getTeamLeaderboard(),
    getPlayerLeaderboard(),
  ]);

  return (
    <LeaderboardsClient
      teamLeaderboard={teamLeaderboard}
      playerLeaderboard={playerLeaderboard}
    />
  );
}
