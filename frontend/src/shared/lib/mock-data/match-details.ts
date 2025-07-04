
export const matchData = {
    id: "match-123",
    tournament: "Кубок ProDvor по Футболу",
    status: "Завершен",
    score: "5-3",
    date: "18 августа 2024",
    time: "18:00",
    location: "Футбольное поле 'Центральный'",
    referee: { name: "Иван Петров" },
    team1: { name: "Дворовые Атлеты", logo: "https://placehold.co/100x100.png", logoHint: 'athletic team logo' },
    team2: { name: "Торпедо", logo: "https://placehold.co/100x100.png", logoHint: 'torpedo logo' },
    lineups: {
        team1: [
            { name: "Superuser", role: "Капитан", avatar: "https://placehold.co/40x40.png", avatarHint: 'sports player' },
            { name: "Echo", role: "Нападающий", avatar: "https://placehold.co/40x40.png", avatarHint: 'sports player' },
            { name: "Viper", role: "Защитник", avatar: "https://placehold.co/40x40.png", avatarHint: 'sports player' },
        ],
        team2: [
            { name: "ColdSniper", role: "Капитан", avatar: "https://placehold.co/40x40.png", avatarHint: 'sports player' },
            { name: "Frosty", role: "Нападающий", avatar: "https://placehold.co/40x40.png", avatarHint: 'sports player' },
            { name: "Howl", role: "Вратарь", avatar: "https://placehold.co/40x40.png", avatarHint: 'sports player' },
        ],
    },
    events: [
        { time: "05:12", event: "Гол", player: "Echo", team: "Дворовые Атлеты" },
        { time: "15:30", event: "Желтая карточка", player: "ColdSniper", team: "Торпедо" },
        { time: "22:45", event: "Гол", player: "Viper", team: "Дворовые Атлеты" },
        { time: "35:01", event: "Финальный свисток", player: "", team: "" },
    ],
    teamStats: {
        goals: { label: "Голы", team1: 5, team2: 3 },
        shotsOnTarget: { label: "Удары в створ", team1: 12, team2: 8 },
        possession: { label: "Владение мячом (%)", team1: 62, team2: 38 },
        corners: { label: "Угловые", team1: 8, team2: 4 },
    },
    media: [
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'football action' },
        { type: "video", src: "https://placehold.co/600x400.png", hint: 'football goal' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'team celebration' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'football player' },
    ]
};
