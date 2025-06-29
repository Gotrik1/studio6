export const contacts = [
    {
        id: 'contact-1',
        name: 'Echo',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player',
        lastMessage: 'Да, я готов к завтрашней тренировке!',
        timestamp: '10 минут назад',
        isOnline: true,
    },
    {
        id: 'contact-2',
        name: 'Viper',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player female',
        lastMessage: 'Отлично сыграли вчера, надо повторить.',
        timestamp: '1 час назад',
        isOnline: false,
    },
    {
        id: 'contact-3',
        name: 'Организатор Турнира',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'event management logo',
        lastMessage: 'Напоминаем, что регистрация закрывается завтра.',
        timestamp: '3 часа назад',
        isOnline: true,
    },
];

export const messages = {
    'contact-1': [
        { sender: 'other', text: 'Привет! Готов к завтрашней тренировке в 19:00?' as const },
        { sender: 'me', text: 'Привет! Да, буду на месте.' as const },
        { sender: 'other', text: 'Отлично. Будем отрабатывать выходы на A.' as const },
        { sender: 'me', text: 'Понял, посмотрю пару демок.' as const },
        { sender: 'other', text: 'Да, я готов к завтрашней тренировке!' as const },
    ],
    'contact-2': [
        { sender: 'other', text: 'Отлично сыграли вчера, надо повторить.' as const },
    ],
    'contact-3': [
         { sender: 'other', text: 'Напоминаем, что регистрация на турнир Summer Kickoff закрывается завтра в 18:00. Убедитесь, что ваша команда подтвердила участие.' as const },
    ]
};

export type Contact = typeof contacts[0];
