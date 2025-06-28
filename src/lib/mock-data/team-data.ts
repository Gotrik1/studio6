export const cyberEaglesSchedule = [
    { opponent: 'Стальные Титаны', tournament: 'Autumn Cyber Clash', date: '2024-10-05 19:00' },
    { opponent: 'Призрачные Волки', tournament: 'City League - Неделя 2', date: '2024-10-12 21:00' },
];

export const cyberEaglesRecentMatches = [
  { id: 1, opponent: "Вихревые Гадюки", score: "13-9", result: "Победа", map: "Ascent" },
  { id: 2, opponent: "Квантовые Квазары", score: "7-13", result: "Поражение", map: "Bind" },
  { id: 3, opponent: "Багровые Крестоносцы", score: "13-5", result: "Победа", map: "Haven" },
];

export const cyberEaglesStats = {
    winrate: '72%',
    currentRank: '#1',
    averageKDA: '1.35',
    favoriteMap: 'Ascent',
};

// A simple "database" lookup
export const getTeamData = (teamId: string) => {
    if (teamId === 'cyber-eagles') {
        return {
            schedule: cyberEaglesSchedule,
            matchHistory: cyberEaglesRecentMatches,
            stats: cyberEaglesStats,
        };
    }
    return null;
}
