

export const summerKickoffTournament = {
    name: "Летний Кубок по Стритболу",
    slug: "summer-streetball-cup-2024",
    game: "Баскетбол",
    status: "Завершен",
    image: "https://placehold.co/1200x400.png",
    dataAiHint: "streetball court action",
    description: "Первый крупный турнир лета по стритболу 3x3 с участием лучших команд платформы.",
    prizePool: "10,000",
    teamsCount: 8,
    organizer: { name: "ProDvor Events", logo: "https://placehold.co/40x40.png" },
    schedule: {
        registration: "15-30 Июня",
        groupStage: "1-3 Июля",
        playoffs: "5-6 Июля",
        finals: "7 Июля",
    },
    teams: [
        { name: "Соколы", logo: "https://placehold.co/40x40.png", dataAiHint: "falcon logo" },
        { name: "Атланты", logo: "https://placehold.co/40x40.png", dataAiHint: "titan logo" },
        { name: "Медведи", logo: "https://placehold.co/40x40.png", dataAiHint: "bear logo" },
        { name: "Гризли", logo: "https://placehold.co/40x40.png", dataAiHint: "grizzly logo" },
    ],
    rules: "Стандартные правила стритбола FIBA 3x3. Формат: группы + Single Elimination плей-офф.",
    bracket: {
        rounds: [
            {
                name: "Четвертьфиналы",
                matches: [
                    { id: 1, team1: { name: "Соколы", logo: "https://placehold.co/40x40.png", dataAiHint: 'falcon logo' }, team2: { name: "Команда A", logo: "https://placehold.co/40x40.png" }, score: "21-15", href: "/matches/123", date: "2024-07-05", time: "18:00" },
                    { id: 2, team1: { name: "Команда B", logo: "https://placehold.co/40x40.png" }, team2: { name: "Медведи", logo: "https://placehold.co/40x40.png", dataAiHint: 'bear logo' }, score: "18-21", href: "/matches/123", date: "2024-07-05", time: "18:00" },
                    { id: 3, team1: { name: "Атланты", logo: "https://placehold.co/40x40.png", dataAiHint: 'titan logo' }, team2: { name: "Команда C", logo: "https://placehold.co/40x40.png" }, score: "22-20", href: "/matches/123", date: "2024-07-05", time: "19:00" },
                    { id: 4, team1: { name: "Команда D", logo: "https://placehold.co/40x40.png" }, team2: { name: "Гризли", logo: "https://placehold.co/40x40.png", dataAiHint: 'grizzly logo' }, score: "11-21", href: "/matches/123", date: "2024-07-05", time: "19:00" },
                ]
            },
            {
                name: "Полуфиналы",
                matches: [
                    { id: 5, team1: { name: "Соколы", logo: "https://placehold.co/40x40.png", dataAiHint: 'falcon logo' }, team2: { name: "Медведи", logo: "https://placehold.co/40x40.png", dataAiHint: 'bear logo' }, score: "21-19", href: "/matches/123", date: "2024-07-06", time: "18:00" },
                    { id: 6, team1: { name: "Атланты", logo: "https://placehold.co/40x40.png", dataAiHint: 'titan logo' }, team2: { name: "Гризли", logo: "https://placehold.co/40x40.png", dataAiHint: 'grizzly logo' }, score: "15-21", href: "/matches/123", date: "2024-07-06", time: "19:00" },
                ]
            },
            {
                name: "Финал",
                matches: [
                     { id: 7, team1: { name: "Соколы", logo: "https://placehold.co/40x40.png", dataAiHint: 'falcon logo' }, team2: { name: "Гризли", logo: "https://placehold.co/40x40.png", dataAiHint: 'grizzly logo' }, score: "22-20", href: "/matches/123", date: "2024-07-07", time: "20:00" },
                ]
            },
            {
                name: "Чемпион",
                matches: [
                    { id: 8, team1: { name: "Соколы", logo: "https://placehold.co/40x40.png", dataAiHint: 'falcon logo' }, winner: true },
                ]
            }
        ]
    },
    media: [
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'basketball court' },
        { type: "video", src: "https://placehold.co/600x400.png", hint: 'basketball slam dunk' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'sports trophy' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'team huddle' },
    ]
};

export const footballCupTournament = {
    name: "Кубок ProDvor по Футболу",
    slug: "prodvor-football-cup-2024",
    game: "Футбол",
    status: "Идет",
    image: "https://placehold.co/1200x400.png",
    dataAiHint: "football stadium action",
    description: "Ежегодный чемпионат по дворовому футболу 5x5. Лучшие команды города сразятся за кубок!",
    prizePool: "50,000",
    teamsCount: 4,
    organizer: { name: "Федерация Дворового Футбола", logo: "https://placehold.co/40x40.png" },
    schedule: {
        registration: "1-15 Августа",
        groupStage: "16-17 Августа",
        playoffs: "18 Августа",
        finals: "19 Августа",
    },
    teams: [
        { name: "Дворовые Атлеты", logo: "https://placehold.co/40x40.png", dataAiHint: "football team logo" },
        { name: "Соколы", logo: "https://placehold.co/40x40.png", dataAiHint: "falcon logo" },
        { name: "Торпедо", logo: "https://placehold.co/40x40.png", dataAiHint: "torpedo logo" },
        { name: "Вымпел", logo: "https://placehold.co/40x40.png", dataAiHint: "pennant logo" },
    ],
    rules: "Правила дворового футбола 5x5. Два тайма по 15 минут. В случае ничьи - серия пенальти.",
    bracket: {
        rounds: [
            {
                name: "Полуфиналы",
                matches: [
                    { id: 1, team1: { name: "Дворовые Атлеты", logo: "https://placehold.co/40x40.png" }, team2: { name: "Торпедо", logo: "https://placehold.co/40x40.png" }, score: "5-3", href: "/matches/123", date: "2024-08-18", time: "18:00" },
                    { id: 2, team1: { name: "Соколы", logo: "https://placehold.co/40x40.png" }, team2: { name: "Вымпел", logo: "https://placehold.co/40x40.png" }, score: "2-4", href: "/matches/123", date: "2024-08-18", time: "19:30" },
                ]
            },
            {
                name: "Финал",
                matches: [
                     { id: 3, team1: { name: "Дворовые Атлеты", logo: "https://placehold.co/40x40.png" }, team2: { name: "Вымпел", logo: "https://placehold.co/40x40.png" }, score: "3-3 (2-1 пен)", href: "/matches/123", date: "2024-08-19", time: "20:00" },
                ]
            },
            {
                name: "Чемпион",
                matches: [
                    { id: 4, team1: { name: "Дворовые Атлеты", logo: "https://placehold.co/40x40.png" }, winner: true },
                ]
            }
        ]
    },
    media: [
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'football goal' },
        { type: "video", src: "https://placehold.co/600x400.png", hint: 'football tackle' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'fans cheering' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'football player portrait' },
    ]
};
