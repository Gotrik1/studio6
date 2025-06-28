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

export const teamStoreItems = [
    { id: 'team-frame-fire', name: 'Командная рамка "Пламя"', price: 1500, image: 'https://placehold.co/600x400.png', imageHint: 'fire frame' },
    { id: 'team-anthem', name: 'Гимн команды "Рок-волна"', price: 3000, image: 'https://placehold.co/600x400.png', imageHint: 'sound wave' },
];
