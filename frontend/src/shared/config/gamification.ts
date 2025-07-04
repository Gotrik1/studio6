export type PdRule = {
    id: string;
    description: string;
    value: number;
    type: 'credit' | 'debit';
    editable: boolean;
    isCustom?: boolean;
};

export const pdRules: PdRule[] = [
    { id: 'REGISTRATION', description: 'Регистрация на платформе', value: 50, type: 'credit', editable: true },
    { id: 'PROFILE_COMPLETION', description: 'Заполнение профиля', value: 100, type: 'credit', editable: true },
    { id: 'FIRST_MATCH', description: 'Первый сыгранный матч', value: 25, type: 'credit', editable: true },
    { id: 'WIN_MATCH', description: 'Победа в матче', value: 50, type: 'credit', editable: true },
    { id: 'CREATE_TEAM', description: 'Создание команды', value: 150, type: 'credit', editable: true },
    { id: 'JOIN_TOURNAMENT', description: 'Участие в турнире', value: 200, type: 'credit', editable: true },
    { id: 'QUEST_COMPLETION', description: 'Выполнение квеста "Новичок"', value: 100, type: 'credit', editable: false },
    { id: 'STORE_PURCHASE_FRAME', description: 'Покупка: Рамка аватара "Пламя"', value: -250, type: 'debit', editable: false },
    { id: 'STORE_PURCHASE_BOOST', description: 'Покупка: Буст ранга (x2 на 7 дней)', value: -350, type: 'debit', editable: false },
    { id: 'TOURNAMENT_FEE', description: 'Взнос за участие в турнире "Weekly Cup"', value: -100, type: 'debit', editable: false },
];

export const pdHistory = [
    { id: 'tx1', timestamp: '2024-07-28T10:00:00Z', source: 'REGISTRATION', value: 50 },
    { id: 'tx2', timestamp: '2024-07-28T11:30:00Z', source: 'PROFILE_COMPLETION', value: 100 },
    { id: 'tx3', timestamp: '2024-07-29T18:00:00Z', source: 'FIRST_MATCH', value: 25 },
    { id: 'tx6', timestamp: '2024-07-31T14:00:00Z', source: 'STORE_PURCHASE_FRAME', value: -250 },
    { id: 'tx4', timestamp: '2024-07-29T19:00:00Z', source: 'WIN_MATCH', value: 50 },
    { id: 'tx7', timestamp: '2024-08-01T10:00:00Z', source: 'TOURNAMENT_FEE', value: -100 },
    { id: 'tx5', timestamp: '2024-07-30T12:00:00Z', source: 'CREATE_TEAM', value: 150 },
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export type Quest = {
  id: string;
  title: string;
  description: string;
  reward: number;
  goal: number;
  progress: number;
  href: string;
};

export const quests = {
    daily: [
        { id: 'd1', title: 'Сыграть 1 матч', description: 'Сыграйте один полный матч в любом режиме.', reward: 20, goal: 1, progress: 0, href: '/matches' },
        { id: 'd2', title: 'Завершить 1 тренировку', description: 'Выполните любую тренировку из вашего дневника.', reward: 30, goal: 1, progress: 1, href: '/training/log' },
        { id: 'd3', title: 'Отметиться на площадке', description: 'Сделайте чекин на любой спортивной площадке.', reward: 10, goal: 1, progress: 0, href: '/playgrounds' },
    ],
    weekly: [
        { id: 'w1', title: '5 побед', description: 'Одержите 5 побед в любых матчах в течение недели.', reward: 150, goal: 5, progress: 2, href: '/matches' },
        { id: 'w2', title: 'Командная работа', description: 'Сыграйте 3 матча в составе одной команды.', reward: 100, goal: 3, progress: 3, href: '/teams' },
    ],
    special: [
         { 
            id: 'q1', 
            title: 'Первые шаги', 
            description: 'Заполните свой профиль полностью, чтобы получить первую награду.', 
            reward: 100, 
            goal: 1,
            progress: 1,
            href: '/profile',
        },
        { 
            id: 'q2', 
            title: 'Боевое крещение', 
            description: 'Сыграйте свой первый матч на платформе.', 
            reward: 25, 
            goal: 1,
            progress: 1,
            href: '/matches',
        },
        { 
            id: 'q3', 
            title: 'Командный игрок', 
            description: 'Вступите в команду или создайте свою.', 
            reward: 150, 
            goal: 1,
            progress: 1,
            href: '/teams',
        },
    ]
};
