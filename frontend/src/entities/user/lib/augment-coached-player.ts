import type { CoachedPlayer, CoachedPlayerSummary } from '../model/types';

export function augmentCoachedPlayer(playerSummary: CoachedPlayerSummary): CoachedPlayer {
  // In a real app, this might involve fetching more data.
  // For the demo, we augment with mock data to create a full CoachedPlayer object.
  return {
    ...playerSummary,
    avatarHint: 'esports player portrait',
    stats: {
      kda: (Math.random() * (1.8 - 0.8) + 0.8).toFixed(1),
      winRate: `${Math.floor(Math.random() * (75 - 50 + 1) + 50)}%`,
      favoriteMap: ['Ascent', 'Bind', 'Split'][Math.floor(Math.random() * 3)],
    },
    matchHistory: ['W 13-8', 'L 10-13', 'W 13-2', 'W 13-5'][Math.floor(Math.random() * 4)],
    adherence: playerSummary.adherence ?? Math.floor(Math.random() * (98 - 75 + 1) + 75),
    progress: Math.floor(Math.random() * (25 - 5 + 1) + 5),
  };
}
