
export const pdHistory = [
    { id: 'tx1', timestamp: '2024-07-28T10:00:00Z', source: 'REGISTRATION', value: 50 },
    { id: 'tx2', timestamp: '2024-07-28T11:30:00Z', source: 'PROFILE_COMPLETION', value: 100 },
    { id: 'tx3', timestamp: '2024-07-29T18:00:00Z', source: 'FIRST_MATCH', value: 25 },
    { id: 'tx6', timestamp: '2024-07-31T14:00:00Z', source: 'STORE_PURCHASE_FRAME', value: -250 },
    { id: 'tx4', timestamp: '2024-07-29T19:00:00Z', source: 'WIN_MATCH', value: 50 },
    { id: 'tx7', timestamp: '2024-08-01T10:00:00Z', source: 'TOURNAMENT_FEE', value: -100 },
    { id: 'tx5', timestamp: '2024-07-30T12:00:00Z', source: 'CREATE_TEAM', value: 150 },
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const quests = [
    { 
        id: 'q1', 
        title: 'Первые шаги', 
        description: 'Заполните свой профиль полностью, чтобы получить первую награду.', 
        reward: 100, 
        isCompleted: true, 
        href: '/profile',
    },
    { 
        id: 'q2', 
        title: 'Боевое крещение', 
        description: 'Сыграйте свой первый матч на платформе.', 
        reward: 25, 
        isCompleted: true,
        href: '/matches',
    },
    { 
        id: 'q3', 
        title: 'Командный игрок', 
        description: 'Вступите в команду или создайте свою.', 
        reward: 150, 
        isCompleted: true,
        href: '/teams',
    },
    { 
        id: 'q4', 
        title: 'Путь к славе', 
        description: 'Примите участие в своем первом турнире.', 
        reward: 200, 
        isCompleted: false,
        href: '/tournaments',
    },
    { 
        id: 'q5', 
        title: 'Душа компании', 
        description: 'Добавьте 5 друзей на платформе.', 
        reward: 50, 
        isCompleted: false,
        href: '/friends',
    },
];
