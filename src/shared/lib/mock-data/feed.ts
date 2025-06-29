import { Bot, Trophy, Award, MessageSquare, LucideIcon } from 'lucide-react';

export const feedData = [
    {
        id: '2',
        type: 'status' as const,
        user: { name: 'Echo', avatar: 'https://placehold.co/100x100.png', avatarHint: 'esports player' },
        icon: MessageSquare,
        timestamp: '2 часа назад',
        content: {
            text: 'Отлично потренировались сегодня! Готовимся к следующему матчу. Кто завтра будет онлайн в 19:00?',
        }
    },
    {
        id: '3',
        type: 'match_result' as const,
        user: { name: 'Кибер Орлы', avatar: 'https://placehold.co/100x100.png', avatarHint: 'eagle logo' },
        icon: Trophy,
        timestamp: '8 часов назад',
        content: {
            tournament: 'Summer Kickoff 2024 - Финал',
            opponent: { name: 'Ледяные Волки', avatar: 'https://placehold.co/100x100.png', avatarHint: 'wolf logo' },
            score: '13-10',
            result: 'Победа' as const,
        }
    },
    {
        id: '4',
        type: 'achievement' as const,
        user: { name: 'Superuser', avatar: 'https://placehold.co/100x100.png', avatarHint: 'esports player' },
        icon: Award,
        timestamp: '1 день назад',
        content: {
            title: 'Первый среди равных',
            description: 'Вы достигли нового ранга, набрав 4001 очков опыта. Так держать!',
        }
    },
];

export type FeedItemData = typeof feedData[0];
