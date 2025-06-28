
export const achievements = [
  { name: "Лучший новичок", icon: "Award", description: "Выиграть награду лучшего новичка сезона.", unlocked: true },
  { name: "Золотая нога", icon: "Star", description: "Забить 50 голов за сезон.", unlocked: true },
  { name: "Чемпион турнира", icon: "Trophy", description: "Выиграть крупный турнир.", unlocked: false },
  { name: "Топ-10 города", icon: "Target", description: "Войти в топ-10 игроков своего города.", unlocked: true },
  { name: "Железный человек", icon: "Medal", description: "Сыграть 100 матчей без замен.", unlocked: false },
  { name: "Командный игрок", icon: "Users", description: "Отдать 50 голевых передач.", unlocked: true },
];

export const teams = [
  { name: "Кибер Орлы", role: "Капитан", logo: "https://placehold.co/128x128.png", dataAiHint: "eagle logo" },
  { name: "Ночные Охотники", role: "Игрок", logo: "https://placehold.co/128x128.png", dataAiHint: "wolf logo" },
];

export const recentMatches = [
  { id: 1, teamA: "Кибер Орлы", scoreA: 13, teamB: "Вихревые Гадюки", scoreB: 9, result: "victory", game: "Valorant", map: "Ascent" },
  { id: 2, teamA: "Кибер Орлы", scoreA: 7, teamB: "Квантовые Квазары", scoreB: 13, result: "defeat", game: "Valorant", map: "Bind" },
  { id: 3, teamA: "Ночные Охотники", scoreA: 16, teamB: "Багровые Крестоносцы", scoreB: 14, result: "victory", game: "CS:GO 2", map: "Mirage" },
];

export const gallery = [
    { src: "https://placehold.co/600x400.png", alt: "Момент с турнира", dataAiHint: "esports gaming" },
    { src: "https://placehold.co/600x400.png", alt: "Командное фото", dataAiHint: "team photo" },
    { src: "https://placehold.co/600x400.png", alt: "Победный крик", dataAiHint: "celebration gaming" },
    { src: "https://placehold.co/600x400.png", alt: "Клатч-момент", dataAiHint: "intense gaming" },
];

export const careerHistory = [
    { teamName: "Юниоры 'Пламя'", period: "2018 - 2020", role: "Нападающий", review: "Отличный старт карьеры, показал себя как перспективный игрок." },
    { teamName: "Городская лига 'Вымпел'", period: "2020 - 2022", role: "Полузащитник", review: "Стал ключевым игроком центра поля, много работал над выносливостью." },
    { teamName: "Кибер Орлы", period: "2022 - н.в.", role: "Капитан", review: "Взял на себя лидерские функции, привел команду к нескольким победам в региональных турнирах." },
];

export const judgeUser = {
  name: 'Судья Джуди',
  email: 'judy.j@prodvor.com',
  role: 'Судья',
  avatar: 'https://placehold.co/100x100.png',
};

export const judgeAchievements = [
  { name: "Первое судейство", icon: "Gavel", description: "Отсудить свой первый официальный матч.", unlocked: true },
  { name: "Турнирный судья", icon: "Trophy", description: "Работать судьей на крупном турнире.", unlocked: true },
  { name: "Железный судья", icon: "CalendarDays", description: "Отсудить 50 матчей за один сезон.", unlocked: true },
  { name: "Награда за честную игру", icon: "Shield", description: "Получить рейтинг справедливости 99%+ от игроков.", unlocked: false },
  { name: "Разрешитель споров", icon: "Scale", description: "Успешно разрешить 20 споров по счету.", unlocked: false },
  { name: "Сертифицированный профи", icon: "ClipboardCheck", description: "Пройти профессиональную сертификацию судей.", unlocked: true },
];

export const userList = [
  { id: 'usr-admin-1', name: 'Admin User', email: 'admin.user@prodvor.com', role: 'Администратор', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/administrator' },
  { id: 'usr-mod-1', name: 'Модератор Макс', email: 'max.mod@prodvor.com', role: 'Модератор', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/moderator' },
  { id: 'usr-mod-2', name: 'Елена Модератова', email: 'elena.m@prodvor.com', role: 'Модератор', status: 'На смене', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/moderator' },
  { id: 'usr-player-1', name: "Alex 'CyberSlasher' Doe", email: 'alex.doe@prodvor.com', role: 'Капитан', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/player' },
  { id: 'usr-player-2', name: "Maria 'Shadow' Petrova", email: 'maria.p@prodvor.com', role: 'Игрок', status: 'Забанен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/player' },
  { id: 'usr-player-3', name: "Иван 'Beast' Орлов", email: 'ivan.o@prodvor.com', role: 'Игрок', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/player' },
  { id: 'usr-judge-1', name: 'Судья Джуди', email: 'judy.j@prodvor.com', role: 'Судья', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/judge' },
  { id: 'usr-manager-1', name: 'Джерри Магуайр', email: 'jerry.m@prodvor.com', role: 'Менеджер', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/manager' },
  { id: 'usr-org-1', name: 'Event Horizon Inc.', email: 'events@horizon.com', role: 'Организатор', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/organizer' },
  { id: 'usr-sponsor-1', name: 'Sponsor Corp', email: 'contact@sponsorcorp.com', role: 'Спонсор', status: 'Проверен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/sponsor' },
  { id: 'usr-fan-1', name: 'Верный Ларри', email: 'larry.fan@prodvor.com', role: 'Болельщик', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/fan' },
  { id: 'usr-fan-2', name: 'Фанат Федор', email: 'fedor.fan@prodvor.com', role: 'Болельщик', status: 'Активен', avatar: 'https://placehold.co/40x40.png', profileUrl: '/administration/fan' },
];
