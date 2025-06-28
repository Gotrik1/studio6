







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

export const leaderboardData = [
    { id: 1, rank: 1, name: "Alex 'CyberSlasher' Doe", avatar: 'https://placehold.co/40x40.png', avatarHint: 'esports player', team: 'Кибер Орлы', elo: 2450, wins: 152, losses: 61, profileUrl: '/profile' },
    { id: 2, rank: 2, name: "Jane 'Venom' Doe", avatar: 'https://placehold.co/40x40.png', avatarHint: 'female gamer', team: 'Вихревые Гадюки', elo: 2410, wins: 140, losses: 65, profileUrl: '#' },
    { id: 3, rank: 3, name: "Alex 'Nova' Ray", avatar: 'https://placehold.co/40x40.png', avatarHint: 'focused gamer', team: 'Квантовые Квазары', elo: 2380, wins: 135, losses: 70, profileUrl: '#' },
    { id: 4, rank: 4, name: "Sam 'The-Rock' Stone", avatar: 'https://placehold.co/40x40.png', avatarHint: 'serious gamer', team: 'Багровые Крестоносцы', elo: 2350, wins: 130, losses: 72, profileUrl: '#' },
    { id: 5, rank: 5, name: "Max 'Titan' Iron", avatar: 'https://placehold.co/40x40.png', avatarHint: 'strong gamer', team: 'Стальные Титаны', elo: 2300, wins: 125, losses: 75, profileUrl: '#' },
    { id: 6, rank: 6, name: "Yuri 'Ghost' Volkov", avatar: 'https://placehold.co/40x40.png', avatarHint: 'wolf logo', team: 'Призрачные Волки', elo: 2280, wins: 120, losses: 80, profileUrl: '#' },
    { id: 7, rank: 7, name: "Frosty", avatar: 'https://placehold.co/40x40.png', avatarHint: 'gamer winter', team: 'Ледяные Драконы', elo: 2250, wins: 118, losses: 82, profileUrl: '#' },
    { id: 8, rank: 8, name: "Olga 'Phoenix' Smirnova", avatar: 'https://placehold.co/40x40.png', avatarHint: 'gamer with headphones', team: 'Кибер Орлы', elo: 2240, wins: 115, losses: 85, profileUrl: '#' },
    { id: 9, rank: 9, name: "Dmitry 'Gadget' Kuznetsov", avatar: 'https://placehold.co/40x40.png', avatarHint: 'tech savvy gamer', team: 'Кибер Орлы', elo: 2230, wins: 114, losses: 86, profileUrl: '#' },
    { id: 10, rank: 10, name: "IceQueen", avatar: 'https://placehold.co/40x40.png', avatarHint: 'ice queen', team: 'Ледяные Драконы', elo: 2220, wins: 112, losses: 88, profileUrl: '#' },
];

export const achievementCatalog: { name: string; description: string; icon: "Trophy" | "Star" | "Shield" | "Gem" | "Crown" | "Rocket" | "Swords" | "Medal" | "Award"; rarity: "Обычная" | "Редкая" | "Эпическая"; points: number }[] = [
    { name: "Новичок в деле", description: "Завершить регистрацию и войти в мир ProDvor.", icon: "Award", rarity: "Обычная", points: 25 },
    { name: "Юный акробат", description: "Сделал кувырок (можно с видео или фото).", icon: "Star", rarity: "Обычная", points: 20 },
    { name: "Не сдался", description: "3 тренировки подряд. Фиксируется расписанием.", icon: "Medal", rarity: "Редкая", points: 70 },
    { name: "Маленький знаток", description: "Назвал 5 правил игры в футбол. Вопросы-ответы с болельщиками.", icon: "Award", rarity: "Редкая", points: 100 },
    
    // Юниоры (U-14 – U-18)
    { name: "Школьный танк", description: "30 отжиманий без остановки.", icon: "Shield", rarity: "Редкая", points: 150 },
    { name: "Режу газон", description: "2 км < 10 минут, подтверждение трекером.", icon: "Rocket", rarity: "Редкая", points: 200 },
    { name: "Битва за район", description: "Победа в школьном матче (командно).", icon: "Swords", rarity: "Эпическая", points: 300 },
    
    // Наследники и Профи (U-21 – PRO-34)
    { name: "Гравитация проиграла", description: "100 подтягиваний.", icon: "Trophy", rarity: "Эпическая", points: 500 },
    { name: "Убежать от скуки", description: "Полумарафон < 2:30.", icon: "Rocket", rarity: "Эпическая", points: 1000 },
    { name: "Золотой выстрел", description: "Победа в матче в роли капитана.", icon: "Crown", rarity: "Эпическая", points: 300 },
    
    // Мастера и Ветераны (M-35+)
    { name: "Седой, но не старый", description: "Участвовал в 10 играх за год.", icon: "Shield", rarity: "Редкая", points: 300 },
    { name: "Мастер дзюдо-слов", description: "Провёл тренировку для молодёжной команды (видео).", icon: "Award", rarity: "Эпическая", points: 500 },

    // Общие и весёлые
    { name: "Дал жару!", description: "Первая победа в рейтинговом матче.", icon: "Trophy", rarity: "Редкая", points: 150 },
    { name: "3 из 3", description: "Победы в трёх матчах подряд.", icon: "Star", rarity: "Эпическая", points: 300 },
    { name: "Без сна", description: "Провёл игру в 6 утра.", icon: "Gem", rarity: "Эпическая", points: 500 },
    { name: "Прямой эфир", description: "Стрим с 10+ зрителями.", icon: "Rocket", rarity: "Редкая", points: 100 },
];

export const chatList = [
    {
        id: 'chat-1',
        name: 'Кибер Орлы (Команда)',
        avatar: 'https://placehold.co/40x40.png',
        dataAiHint: "eagle logo",
        lastMessage: {
            text: 'Ребята, тренировка завтра в 18:00 на базе. Не опаздывать!',
            time: '15:30',
        },
        unreadCount: 2,
        messages: [
            { sender: 'other', text: 'Всем привет! Как настрой перед игрой?', time: '14:20' },
            { sender: 'me', text: 'Боевой! Готов разрывать!', time: '14:21' },
            { sender: 'other', text: 'Так держать! Maria, ты успеваешь к началу?', time: '14:21' },
            { sender: 'other', text: 'Да, буду через 15 минут.', time: '14:22' },
            { sender: 'me', text: 'Супер. Я уже на месте, разминаюсь.', time: '14:23' },
            { sender: 'other', text: 'Ребята, тренировка завтра в 18:00 на базе. Не опаздывать!', time: '15:30' },
        ]
    },
    {
        id: 'chat-2',
        name: 'Тренер Картер',
        avatar: 'https://placehold.co/40x40.png',
        dataAiHint: "sports coach",
        lastMessage: {
            text: 'Отличная игра сегодня, горжусь вами!',
            time: 'Вчера',
        },
        unreadCount: 0,
        messages: [
            { sender: 'other', text: 'Отличная игра сегодня, горжусь вами!', time: 'Вчера, 21:05' },
            { sender: 'me', text: 'Спасибо, тренер! Старались!', time: 'Вчера, 21:10' }
        ]
    },
    {
        id: 'chat-3',
        name: 'Summer Kickoff 2024 (Турнир)',
        avatar: 'https://placehold.co/40x40.png',
        dataAiHint: "trophy icon",
        lastMessage: {
            text: 'Организатор: Напоминаем, что взносы...',
            time: '2 д. назад',
        },
        unreadCount: 5,
        messages: [
             { sender: 'other', text: 'Организатор: Напоминаем, что взносы нужно оплатить до пятницы.', time: '2 д. назад' }
        ]
    },
    {
        id: 'chat-4',
        name: 'Джерри Магуайр (Менеджер)',
        avatar: 'https://placehold.co/40x40.png',
        dataAiHint: "business manager",
        lastMessage: {
            text: 'Есть предложение от нового спонсора. Обсудим?',
            time: '18.09.24',
        },
        unreadCount: 0,
        messages: []
    },
    {
        id: 'chat-5',
        name: 'Болельщики "Кибер Орлов"',
        avatar: 'https://placehold.co/40x40.png',
        dataAiHint: "fan club",
        lastMessage: {
            text: 'Верный Ларри: Кто идет на матч в субботу?',
            time: '18.09.24',
        },
        unreadCount: 12,
        messages: []
    }
];

export const promotionsList = [
  {
    name: "Конкурс на лучший игровой момент",
    sponsor: "GamerGear",
    description: "Присылайте свои лучшие игровые моменты и выигрывайте новейшую игровую гарнитуру!",
    prize: "Гарнитура HyperX Cloud III",
    participants: 128,
    status: "Активна",
    image: "https://placehold.co/600x400.png",
    imageHint: "gaming headset"
  },
  {
    name: "Турнир 1v1 от Energy Drink Co.",
    sponsor: "Energy Drink Co.",
    description: "Покажите свое мастерство в дуэлях 1 на 1 и получите годовой запас нашего энергетического напитка.",
    prize: "Годовой запас энергетика",
    participants: 256,
    status: "Активна",
    image: "https://placehold.co/600x400.png",
    imageHint: "energy drink can"
  },
  {
    name: "Ранний доступ к бета-тесту 'CyberFuture'",
    sponsor: "Future Games",
    description: "Первые 100 зарегистрировавшихся получат эксклюзивный доступ к закрытому бета-тестированию новой игры.",
    prize: "Ключ к ЗБТ 'CyberFuture'",
    participants: 78,
    status: "Скоро",
    image: "https://placehold.co/600x400.png",
    imageHint: "futuristic city"
  }
];

export const sponsorsList = [
    { name: "GamerGear", logo: "https://placehold.co/150x50.png", logoHint: "gaming brand logo" },
    { name: "Energy Drink Co.", logo: "https://placehold.co/150x50.png", logoHint: "beverage logo" },
    { name: "TechSponsor", logo: "https://placehold.co/150x50.png", logoHint: "corporate logo" },
    { name: "Future Games", logo: "https://placehold.co/150x50.png", logoHint: "game developer logo" },
];

export const pdHistory = [
    { id: 'pd-0', timestamp: '2024-09-23T20:14:00Z', source: 'WELCOME_BONUS', value: 25, refId: 'registration' },
    { id: 'pd-1', timestamp: '2024-09-26T10:00:00Z', source: 'MATCH_COMPLETION', value: 10, refId: 'match-123' },
    { id: 'pd-2', timestamp: '2024-09-26T10:05:00Z', source: 'GOAL_ASSIST_SAVE', value: 5, refId: 'match-123' },
    { id: 'pd-3', timestamp: '2024-09-25T18:30:00Z', source: 'MEDIA_POST_TIER_1', value: 3, refId: 'post-456' },
    { id: 'pd-4', timestamp: '2024-09-25T14:00:00Z', source: 'REFEREE_MATCH', value: 15, refId: 'match-121' },
    { id: 'pd-5', timestamp: '2024-09-24T11:00:00Z', source: 'INVITE_FRIEND', value: 10, refId: 'user-789' },
    { id: 'pd-6', timestamp: '2024-09-23T20:15:00Z', source: 'HELP_NEWBIE', value: 7, refId: 'user-xyz' },
    { id: 'pd-7', timestamp: '2024-09-23T19:00:00Z', source: 'MATCH_COMPLETION', value: 10, refId: 'match-120' },
];

export const storeItems = [
    {
        id: 'theme-cyberpunk',
        name: 'Тема "Киберпанк"',
        description: 'Неоновые огни и мрачное будущее в вашем профиле.',
        price: 250,
        type: 'theme',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'cyberpunk city neon'
    },
    {
        id: 'theme-solar',
        name: 'Тема "Солнечная система"',
        description: 'Космический пейзаж для вашего профиля.',
        price: 250,
        type: 'theme',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'solar system'
    },
    {
        id: 'badge-fire',
        name: 'Анимированный значок "Пламя"',
        description: 'Покажите всем свой огонь!',
        price: 500,
        type: 'badge',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'animated fire'
    },
    {
        id: 'frame-gold',
        name: 'Золотая рамка для аватара',
        description: 'Элитная рамка для элитных игроков.',
        price: 1000,
        type: 'frame',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'gold frame'
    },
];

export const lootboxPrizes: { name: string; rarity: 'Обычный' | 'Редкий' | 'Эпический'; image: string; imageHint: string; }[] = [
    { name: "Рамка 'Неон'", rarity: 'Обычный', image: 'https://placehold.co/128x128.png', imageHint: 'neon frame' },
    { name: "Стикер 'GG WP'", rarity: 'Обычный', image: 'https://placehold.co/128x128.png', imageHint: 'sticker ggwp' },
    { name: "Тема 'Лес'", rarity: 'Обычный', image: 'https://placehold.co/128x128.png', imageHint: 'forest theme' },
    { name: "Рамка 'Пламя'", rarity: 'Редкий', image: 'https://placehold.co/128x128.png', imageHint: 'fire frame' },
    { name: "Значок 'MVP'", rarity: 'Редкий', image: 'https://placehold.co/128x128.png', imageHint: 'mvp badge' },
    { name: "Рамка 'Легенда'", rarity: 'Эпический', image: 'https://placehold.co/128x128.png', imageHint: 'legendary frame' },
];

export const partnerOffers = [
    {
        id: 'partner-1',
        sponsor: 'GamerGear',
        title: 'Скидка 15% на всю продукцию',
        description: 'Получите эксклюзивный промокод на скидку в официальном магазине GamerGear.',
        price: 500,
        logo: 'https://placehold.co/100x40.png',
        logoHint: 'gaming brand logo'
    },
    {
        id: 'partner-2',
        sponsor: 'Energy Drink Co.',
        title: 'Ящик энергетика в подарок',
        description: 'Обменяйте PD на промокод, который даст вам право на получение ящика (24 банки) нашего нового вкуса.',
        price: 1500,
        logo: 'https://placehold.co/100x40.png',
        logoHint: 'beverage logo'
    },
];

export const ticketEvents = [
    {
        id: 'ticket-1',
        name: 'Финал Summer Kickoff 2024',
        date: '17 августа 2024',
        location: 'Арена "Колизей"',
        price: 200,
        image: 'https://placehold.co/600x400.png',
        imageHint: 'esports stadium lights'
    }
];

export const recentDonors = [
    { id: 'donor-1', name: "Alex 'CyberSlasher' Doe", amount: 1000, avatar: 'https://placehold.co/40x40.png', avatarHint: 'esports player' },
    { id: 'donor-2', name: 'Команда "Вихревые Гадюки"', amount: 5000, avatar: 'https://placehold.co/40x40.png', avatarHint: 'snake logo' },
    { id: 'donor-3', name: 'Верный Ларри', amount: 50, avatar: 'https://placehold.co/40x40.png', avatarHint: 'sports fan' },
];

export const teamPdHistory = [
    { id: 'tpd-1', timestamp: '2024-09-26T12:00:00Z', source: 'Взнос капитана', value: 1000, user: "Alex 'CyberSlasher' Doe" },
    { id: 'tpd-2', timestamp: '2024-09-25T19:00:00Z', source: 'Победа в турнире', value: 5000, user: "Система" },
    { id: 'tpd-3', timestamp: '2024-09-24T10:00:00Z', source: 'Покупка командной рамки', value: -1500, user: "Alex 'CyberSlasher' Doe" },
    { id: 'tpd-4', timestamp: '2024-09-23T15:00:00Z', source: 'Спонсорский бонус', value: 2000, user: "Sponsor Corp" },
];

export const teamStoreItems = [
    { id: 'team-frame-fire', name: 'Командная рамка "Пламя"', price: 1500, image: 'https://placehold.co/600x400.png', imageHint: 'fire frame' },
    { id: 'team-anthem', name: 'Гимн команды "Рок-волна"', price: 3000, image: 'https://placehold.co/600x400.png', imageHint: 'sound wave' },
];

export const teamLeaderboardData = [
    { id: 1, rank: 1, name: 'Кибер Орлы', avatar: 'https://placehold.co/40x40.png', avatarHint: 'eagle logo', totalPd: 6500, profileUrl: '/teams/cyber-eagles' },
    { id: 2, rank: 2, name: 'Ледяные Драконы', avatar: 'https://placehold.co/40x40.png', avatarHint: 'dragon logo', totalPd: 5200, profileUrl: '#' },
    { id: 3, rank: 3, name: 'Вихревые Гадюки', avatar: 'https://placehold.co/40x40.png', avatarHint: 'snake logo', totalPd: 4800, profileUrl: '#' },
    { id: 4, rank: 4, name: 'Квантовые Квазары', avatar: 'https://placehold.co/40x40.png', avatarHint: 'galaxy logo', totalPd: 3500, profileUrl: '#' },
];
