export const fanLeaderboard = [
    { rank: 1, name: "Верный Ларри", avatar: "https://placehold.co/40x40.png", avatarHint: "sports fan", points: 12540, favoriteTeam: "Кибер Орлы" },
    { rank: 2, name: "SuperFan99", avatar: "https://placehold.co/40x40.png", avatarHint: "gamer girl", points: 11890, favoriteTeam: "Ледяные Драконы" },
    { rank: 3, name: "Dragon_Slayer", avatar: "https://placehold.co/40x40.png", avatarHint: "fantasy warrior", points: 10500, favoriteTeam: "Ледяные Драконы" },
    { rank: 4, name: "GamerMom", avatar: "https://placehold.co/40x40.png", avatarHint: "woman portrait", points: 9800, favoriteTeam: "Вихревые Гадюки" },
    { rank: 5, name: "OldSchoolGamer", avatar: "https://placehold.co/40x40.png", avatarHint: "older man", points: 9550, favoriteTeam: "Стальные Титаны" },
];

export const weeklyPoll = {
    id: "poll-mvp-week-1",
    title: "MVP Недели",
    question: "Кто был лучшим игроком на этой неделе?",
    options: [
        { id: "opt-1", text: "Alex 'CyberSlasher' Doe", votes: 450 },
        { id: "opt-2", text: "Jane 'Venom' Doe", votes: 320 },
        { id: "opt-3", text: "Frosty", votes: 280 },
        { id: "opt-4", text: "Другой игрок", votes: 150 },
    ],
    totalVotes: 1200,
};

export const followedTeamsFeed = [
    {
        id: 1,
        author: { name: "Кибер Орлы", avatar: "https://placehold.co/40x40.png", avatarHint: "eagle logo" },
        timestamp: "1 час назад",
        content: "Готовимся к финалу! Спасибо всем за поддержку, вы наша главная мотивация! #GoEagles",
    },
    {
        id: 2,
        author: { name: "Alex 'CyberSlasher' Doe", avatar: "https://placehold.co/40x40.png", avatarHint: "esports player" },
        timestamp: "5 часов назад",
        content: "Разбираем реплеи вчерашней игры. Нашел пару интересных моментов, которыми поделюсь на стриме.",
    },
];

export const followedTeamsMatches = [
    { id: "match-f-1", team1: "Кибер Орлы", team2: "Стальные Титаны", time: "Завтра, 19:00" },
    { id: "match-f-2", team1: "Ледяные Драконы", team2: "Квантовые Квазары", time: "28.09, 21:00" },
];
