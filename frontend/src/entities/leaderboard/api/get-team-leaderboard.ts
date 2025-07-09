"use server";

import type { TeamLeaderboardItem } from "@/entities/leaderboard/model/types";

export async function getTeamLeaderboard(
  game?: string,
): Promise<TeamLeaderboardItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl) {
    console.error("Backend URL not configured");
    return [];
  }
  const url = game
    ? `${baseUrl}/teams/leaderboard?game=${encodeURIComponent(game)}`
    : `${baseUrl}/teams/leaderboard`;
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
