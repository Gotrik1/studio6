
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

export const matchesList = [
  {
    id: 'match-1',
    team1: { name: "Кибер Орлы", logo: "https://placehold.co/40x40.png", logoHint: "eagle logo" },
    team2: { name: "Ледяные Драконы", logo: "https://placehold.co/40x40.png", logoHint: "dragon logo" },
    score: "2-1",
    tournament: "Summer Kickoff 2024 - Финал",
    status: "Завершен",
    date: "17 августа 2024",
    href: "/match-details"
  },
  {
    id: 'match-2',
    team1: { name: "Вихревые Гадюки", logo: "https://placehold.co/40x40.png", logoHint: "snake logo" },
    team2: { name: "Квантовые Квазары", logo: "https://placehold.co/40x40.png", logoHint: "galaxy logo" },
    score: "0-2",
    tournament: "Summer Kickoff 2024 - Полуфинал",
    status: "Завершен",
    date: "16 августа 2024",
    href: "#"
  },
  {
    id: 'match-3',
    team1: { name: "Стальные Титаны", logo: "https://placehold.co/40x40.png", logoHint: "robot titan" },
    team2: { name: "Багровые Крестоносцы", logo: "https://placehold.co/40x40.png", logoHint: "knight logo" },
    score: "1-2",
    tournament: "Autumn Cyber Clash - Групповой этап",
    status: "Идет",
    date: "25 сентября 2024",
    href: "#"
  },
  {
    id: 'match-4',
    team1: { name: "Призрачные Волки", logo: "https://placehold.co/40x40.png", logoHint: "wolf logo" },
    team2: { name: "Теневые Коты", logo: "https://placehold.co/40x40.png", logoHint: "cat logo" },
    score: "vs",
    tournament: "City League - Неделя 1",
    status: "Предстоящий",
    date: "28 сентября 2024",
    href: "#"
  }
];

export const venuesList = [
  {
    id: 'venue-1',
    name: 'Футбольное поле "Центральное"',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'football field aerial',
    address: 'ул. Центральная, 1, Москва',
    surfaceType: 'Искусственный газон',
    hasLighting: true,
    rating: 4.8,
    price: '1500 ₽/час',
    features: ['Душевые', 'Раздевалки', 'Освещение'],
  },
  {
    id: 'venue-2',
    name: 'Баскетбольная площадка "Стритбол"',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'basketball court city',
    address: 'Парк "Южный", Москва',
    surfaceType: 'Резиновое покрытие',
    hasLighting: true,
    rating: 4.5,
    price: 'Бесплатно',
    features: ['Освещение'],
  },
  {
    id: 'venue-3',
    name: 'Волейбольная площадка "Пляж"',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'beach volleyball',
    address: 'Набережная реки, Москва',
    surfaceType: 'Песок',
    hasLighting: false,
    rating: 4.2,
    price: '500 ₽/час',
    features: ['Раздевалки'],
  },
  {
    id: 'venue-4',
    name: 'Теннисный корт "Академия"',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'tennis court',
    address: 'ул. Спортивная, 10, Москва',
    surfaceType: 'Грунт',
    hasLighting: true,
    rating: 4.9,
    price: '2000 ₽/час',
    features: ['Душевые', 'Раздевалки', 'Освещение', 'Прокат инвентаря'],
  },
];

export const myBookings = [
    {
        id: 'booking-1',
        venueName: 'Футбольное поле "Центральное"',
        date: '28 сентября 2024',
        time: '19:00 - 20:00',
        status: 'Подтверждено',
    },
    {
        id: 'booking-2',
        venueName: 'Теннисный корт "Академия"',
        date: '22 сентября 2024',
        time: '10:00 - 12:00',
        status: 'Завершено',
    },
    {
        id: 'booking-3',
        venueName: 'Баскетбольная площадка "Стритбол"',
        date: '15 сентября 2024',
        time: '18:00 - 19:00',
        status: 'Отменено',
    }
];
