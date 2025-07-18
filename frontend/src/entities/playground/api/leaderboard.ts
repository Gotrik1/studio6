"use server";

import { fetchWithAuth } from "@/shared/lib/api-client";

export type PlaygroundLeaderboardItem = {
  id: string;
  rank: number;
  name: string;
  avatar: string | null;
  checkIns: number;
};

type BackendLeaderboardItem = {
  userId: string;
  _count: { userId: number };
  rank?: number;
  name?: string;
  avatar?: string | null;
  checkIns?: number;
};

export async function getPlaygroundLeaderboard(
  playgroundId: string,
): Promise<PlaygroundLeaderboardItem[]> {
  const result = await fetchWithAuth<BackendLeaderboardItem[]>(
    `/playgrounds/${playgroundId}/leaderboard`,
  );

  if (!result.success || !Array.isArray(result.data)) {
    if (!result.success) {
      console.error(
        `Failed to fetch leaderboard for playground ${playgroundId}:`,
        result.error,
      );
    }
    return [];
  }

  return result.data.map((item: BackendLeaderboardItem, index: number) => ({
    id: String(item.userId),
    rank: item.rank ?? index + 1,
    name: item.name || "Неизвестный игрок",
    avatar: item.avatar || null,
    checkIns: item._count.userId,
  }));
}
