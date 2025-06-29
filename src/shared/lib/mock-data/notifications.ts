import { UserPlus, Trophy, MessageSquare, Gavel } from 'lucide-react';

export const notifications = [
    {
        id: '1',
        title: 'Новый запрос в друзья',
        description: 'Игрок "ShadowStriker" хочет добавить вас в друзья.',
        timestamp: '5 минут назад',
        href: '/friends',
        icon: UserPlus,
        isRead: false,
    },
    {
        id: '2',
        title: 'Регистрация на турнир',
        description: 'Вы успешно зарегистрировались на турнир "Summer Kickoff 2024".',
        timestamp: '1 час назад',
        href: '/tournaments/summer-kickoff-2024',
        icon: Trophy,
        isRead: false,
    },
    {
        id: '3',
        title: 'Новое сообщение',
        description: 'От "TeamCaptain": "Не забудьте подтвердить участие в завтрашнем матче."',
        timestamp: '3 часа назад',
        href: '/chats',
        icon: MessageSquare,
        isRead: true,
    },
    {
        id: '4',
        title: 'Решение по жалобе',
        description: 'Ваша жалоба на игрока "ToxicPlayer" была рассмотрена. Вынесено предупреждение.',
        timestamp: '1 день назад',
        href: '/support',
        icon: Gavel,
        isRead: true,
    },
];
