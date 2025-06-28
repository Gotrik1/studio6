export const coachedPlayers = [
    {
        id: 'player-1',
        name: "Maria 'Shadow' Petrova",
        role: "Смоукер",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "female gamer",
        stats: {
            winRate: '65%',
            kda: 1.4,
            favoriteMap: 'Bind',
        },
        matchHistory: 'vs Кибер Орлы: 13-9 (Победа)\nvs Теневые Коты: 10-13 (Поражение)',
    },
    {
        id: 'player-2',
        name: "Ivan 'Beast' Orlov",
        role: "Страж",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "focused gamer",
        stats: {
            winRate: '58%',
            kda: 0.9,
            favoriteMap: 'Haven',
        },
        matchHistory: 'vs Вихревые Гадюки: 13-11 (Победа)\nvs Ледяные Драконы: 5-13 (Поражение)',
    },
    {
        id: 'player-3',
        name: "Olga 'Phoenix' Smirnova",
        role: "Зачинщик",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "gamer with headphones",
         stats: {
            winRate: '71%',
            kda: 1.6,
            favoriteMap: 'Ascent',
        },
        matchHistory: 'vs Квантовые Квазары: 13-2 (Победа)\nvs Стальные Титаны: 13-10 (Победа)',
    },
];

export type CoachedPlayer = (typeof coachedPlayers)[0];
