
export const summerKickoffTournament = {
    name: "Летний Старт 2024",
    slug: "summer-kickoff-2024",
    game: "Valorant",
    status: "Завершен",
    image: "https://placehold.co/1200x400.png",
    dataAiHint: "esports valorant stage",
    description: "Первый крупный турнир лета с участием лучших команд платформы. Приготовьтесь к жарким битвам!",
    prizePool: "10,000",
    teamsCount: 16,
    organizer: { name: "ProDvor Events", logo: "https://placehold.co/40x40.png" },
    schedule: {
        registration: "15-30 Июня",
        groupStage: "1-3 Июля",
        playoffs: "5-6 Июля",
        finals: "7 Июля",
    },
    teams: [
        { name: "Кибер Орлы", logo: "https://placehold.co/40x40.png", dataAiHint: "eagle logo" },
        { name: "Ледяные Волки", logo: "https://placehold.co/40x40.png", dataAiHint: "wolf logo" },
        { name: "Теневые Лисы", logo: "https://placehold.co/40x40.png", dataAiHint: "fox logo" },
        { name: "Стальные Титаны", logo: "https://placehold.co/40x40.png", dataAiHint: "titan logo" },
    ],
    rules: "Стандартные соревновательные правила Valorant. Формат: группы + Single Elimination плей-офф.",
    bracket: {
        rounds: [
            {
                name: "Четвертьфиналы",
                matches: [
                    { id: 1, team1: { name: "Кибер Орлы", logo: "https://placehold.co/40x40.png", dataAiHint: 'eagle logo' }, team2: { name: "Команда A", logo: "https://placehold.co/40x40.png" }, score: "13-5", href: "/matches/123" },
                    { id: 2, team1: { name: "Команда B", logo: "https://placehold.co/40x40.png" }, team2: { name: "Теневые Лисы", logo: "https://placehold.co/40x40.png", dataAiHint: 'fox logo' }, score: "9-13", href: "/matches/123" },
                    { id: 3, team1: { name: "Ледяные Волки", logo: "https://placehold.co/40x40.png", dataAiHint: 'wolf logo' }, team2: { name: "Команда C", logo: "https://placehold.co/40x40.png" }, score: "13-2", href: "/matches/123" },
                    { id: 4, team1: { name: "Команда D", logo: "https://placehold.co/40x40.png" }, team2: { name: "Стальные Титаны", logo: "https://placehold.co/40x40.png", dataAiHint: 'titan logo' }, score: "11-13", href: "/matches/123" },
                ]
            },
            {
                name: "Полуфиналы",
                matches: [
                    { id: 5, team1: { name: "Кибер Орлы", logo: "https://placehold.co/40x40.png", dataAiHint: 'eagle logo' }, team2: { name: "Теневые Лисы", logo: "https://placehold.co/40x40.png", dataAiHint: 'fox logo' }, score: "2-1", href: "/matches/123" },
                    { id: 6, team1: { name: "Ледяные Волки", logo: "https://placehold.co/40x40.png", dataAiHint: 'wolf logo' }, team2: { name: "Стальные Титаны", logo: "https://placehold.co/40x40.png", dataAiHint: 'titan logo' }, score: "0-2", href: "/matches/123" },
                ]
            },
            {
                name: "Финал",
                matches: [
                     { id: 7, team1: { name: "Кибер Орлы", logo: "https://placehold.co/40x40.png", dataAiHint: 'eagle logo' }, team2: { name: "Стальные Титаны", logo: "https://placehold.co/40x40.png", dataAiHint: 'titan logo' }, score: "3-1", href: "/matches/123" },
                ]
            },
            {
                name: "Чемпион",
                matches: [
                    { id: 8, team1: { name: "Кибер Орлы", logo: "https://placehold.co/40x40.png", dataAiHint: 'eagle logo' }, winner: true },
                ]
            }
        ]
    }
};
