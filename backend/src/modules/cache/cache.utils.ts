// /backend/src/modules/cache/cache.utils.ts

export const generateUserCacheKey = (userId: string) => `user:${userId}`;
export const generateTeamCacheKey = (slug: string) => `team:${slug}`;
export const generateLeaderboardCacheKey = (game?: string) => `leaderboard:teams:${game || 'all'}`;
