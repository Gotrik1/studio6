
export const RANKS = [
    { name: "Новичок", minPoints: 0, color: "text-gray-400" },
    { name: "Любитель", minPoints: 500, color: "text-green-500" },
    { name: "Опытный", minPoints: 1500, color: "text-blue-500" },
    { name: "Профи", minPoints: 3000, color: "text-purple-500" },
    { name: "Мастер", minPoints: 5000, color: "text-orange-500" },
    { name: "Легенда", minPoints: 10000, color: "text-red-500" },
];

export const getRankByPoints = (points: number) => {
    let currentRank = RANKS[0];
    for (const rank of RANKS) {
        if (points >= rank.minPoints) {
            currentRank = { ...rank, description: `Требуется ${rank.minPoints} PD` };
        } else {
            break;
        }
    }
    return currentRank;
};
