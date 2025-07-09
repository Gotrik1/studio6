"use server";

import type { TeamLeaderboardItem } from "@/entities/leaderboard/model/types";

export async function getTeamLeaderboard(
  game?: string,
): Promise<TeamLeaderboardItem[]> {
  const url = game
    ? `${process.env.BACKEND_URL}/teams/leaderboard?game=${encodeURIComponent(game)}`
    : `${process.env.BACKEND_URL}/teams/leaderboard`;
  try {
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Failed to fetch team leaderboard:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching team leaderboard:", error);
    return [];
  }
}
