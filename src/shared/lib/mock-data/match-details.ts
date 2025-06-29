
export const matchData = {
    id: "match-123",
    tournament: "Летний Старт 2024",
    status: "Завершен",
    score: "13-10",
    date: "26 июля 2024",
    time: "18:00",
    location: "Онлайн",
    referee: { name: "Иван Петров" },
    team1: { name: "Кибер Орлы", logo: "https://placehold.co/100x100.png", logoHint: 'eagle logo' },
    team2: { name: "Ледяные Волки", logo: "https://placehold.co/100x100.png", logoHint: 'wolf logo' },
    lineups: {
        team1: [
            { name: "Superuser", role: "Капитан", avatar: "https://placehold.co/40x40.png", avatarHint: 'esports player' },
            { name: "Echo", role: "Дуэлянт", avatar: "https://placehold.co/40x40.png", avatarHint: 'esports player' },
            { name: "Viper", role: "Страж", avatar: "https://placehold.co/40x40.png", avatarHint: 'esports player' },
        ],
        team2: [
            { name: "ColdSniper", role: "Капитан", avatar: "https://placehold.co/40x40.png", avatarHint: 'esports player' },
            { name: "Frosty", role: "Дуэлянт", avatar: "https://placehold.co/40x40.png", avatarHint: 'esports player' },
            { name: "Howl", role: "Страж", avatar: "https://placehold.co/40x40.png", avatarHint: 'esports player' },
        ],
    },
    events: [
        { time: "05:12", event: "Первая кровь", player: "Echo", team: "Кибер Орлы" },
        { time: "15:30", event: "Эйс", player: "ColdSniper", team: "Ледяные Волки" },
        { time: "22:45", event: "Установка Spike", player: "Viper", team: "Кибер Орлы" },
        { time: "35:01", event: "Матч-поинт", player: "Superuser", team: "Кибер Орлы" },
    ],
    teamStats: {
        kills: { label: "Убийства", team1: 58, team2: 52 },
        assists: { label: "Ассисты", team1: 30, team2: 40 },
        headshots: { label: "Хедшоты (%)", team1: 25, team2: 22 },
        firstBloods: { label: "Первая кровь", team1: 12, team2: 11 },
    },
    media: [
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'esports action' },
        { type: "video", src: "https://placehold.co/600x400.png", hint: 'esports highlight' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'team celebration' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'esports player' },
    ]
};
