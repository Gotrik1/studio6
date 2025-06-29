export const achievements = [
    { name: 'Первая победа', description: 'Выиграть первый матч', icon: 'Award', unlocked: true },
    { name: 'Командный игрок', description: 'Сыграть 10 матчей с командой', icon: 'Users', unlocked: true },
    { name: 'Железная воля', description: 'Завершить 5 тренировок за неделю', icon: 'Dumbbell', unlocked: true },
    { name: 'Конструктор успеха', description: 'Создать первую AI-программу', icon: 'BrainCircuit', unlocked: true },
    { name: 'Чемпион турнира', description: 'Выиграть турнир', icon: 'Trophy', unlocked: false },
    { name: 'Меткий стрелок', description: '100 хедшотов', icon: 'Target', unlocked: true },
    { name: 'MVP', description: 'Стать лучшим игроком матча', icon: 'Medal', unlocked: true },
    { name: 'Ветеран', description: 'Сыграть 100 матчей', icon: 'Star', unlocked: false },
    { name: 'Персональный рекорд', description: 'Установить новый личный рекорд в упражнении', icon: 'TrendingUp', unlocked: false },
    { name: 'Дисциплина', description: 'Заполнить дневник 7 дней подряд', icon: 'ClipboardCheck', unlocked: false },
];

export const teams = [
    { name: 'Кибер Орлы', role: 'Капитан', logo: 'https://placehold.co/100x100.png', dataAiHint: 'eagle logo'},
    { name: 'Стальные Титаны', role: 'Игрок', logo: 'https://placehold.co/100x100.png', dataAiHint: 'titan logo'},
];

export const recentMatches = [
    { id: 1, teamA: 'Кибер Орлы', scoreA: 13, teamB: 'Ледяные Волки', scoreB: 10, game: 'Valorant', map: 'Ascent' },
    { id: 2, teamA: 'Кибер Орлы', scoreA: 8, teamB: 'Теневые Лисы', scoreB: 13, game: 'Valorant', map: 'Bind' },
];

export const gallery = [
    { src: 'https://placehold.co/600x400.png', alt: 'Скриншот из игры', dataAiHint: 'valorant screenshot' },
    { src: 'https://placehold.co/600x400.png', alt: 'Фото с турнира', dataAiHint: 'esports tournament' },
    { src: 'https://placehold.co/600x400.png', alt: 'Лучший момент', dataAiHint: 'gaming highlights' },
    { src: 'https://placehold.co/600x400.png', alt: 'Командное фото', dataAiHint: 'team photo' },
];

export const careerHistory = [
    { teamName: 'Ночные Снайперы', period: '2022-2023', role: 'Запасной игрок', review: 'Показал большой потенциал во время тренировок.' },
    { teamName: 'Кибер Орлы', period: '2023-н.в.', role: 'Капитан / IGL', review: 'Привел команду к победе в нескольких региональных турнирах.' },
];
