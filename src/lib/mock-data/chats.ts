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
