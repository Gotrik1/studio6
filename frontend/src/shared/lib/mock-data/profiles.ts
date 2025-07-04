
export const achievements = [
    { name: 'Первая победа', description: 'Выиграть первый матч', icon: 'Award', unlocked: true },
    { name: 'Командный игрок', description: 'Сыграть 10 матчей с командой', icon: 'Users', unlocked: true },
    { name: 'Железная воля', description: 'Завершить 5 тренировок за неделю', icon: 'Dumbbell', unlocked: true },
    { name: 'Конструктор успеха', description: 'Создать первую AI-программу', icon: 'BrainCircuit', unlocked: true },
    { name: 'Чемпион турнира', description: 'Выиграть турнир', icon: 'Trophy', unlocked: false },
    { name: 'Меткий удар', description: 'Забить 10 голов', icon: 'Target', unlocked: true },
    { name: 'MVP', description: 'Стать лучшим игроком матча', icon: 'Medal', unlocked: true },
    { name: 'Ветеран', description: 'Сыграть 100 матчей', icon: 'Star', unlocked: false },
    { name: 'Персональный рекорд', description: 'Установить новый личный рекорд в упражнении', icon: 'TrendingUp', unlocked: false },
    { name: 'Дисциплина', description: 'Заполнить дневник 7 дней подряд', icon: 'ClipboardCheck', unlocked: false },
];

export const teams = [
    { name: 'Дворовые Атлеты', role: 'Капитан', logo: 'https://placehold.co/100x100.png', dataAiHint: 'athletic team logo', slug: 'dvotovyie-atlety', rank: 1, game: 'Футбол'},
    { name: 'Соколы', role: 'Игрок', logo: 'https://placehold.co/100x100.png', dataAiHint: 'falcon logo', slug: 'sokoly', rank: 4, game: 'Баскетбол'},
];

export const careerHistory = [
    { teamName: 'Юность', period: '2022-2023', role: 'Запасной игрок', review: 'Показал большой потенциал во время тренировок.' },
    { teamName: 'Дворовые Атлеты', period: '2023-н.в.', role: 'Капитан', review: 'Привел команду к победе в нескольких региональных турнирах.' },
];
