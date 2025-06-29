import type { LucideIcon } from 'lucide-react';
import { Award, UserPlus, Trophy, Dumbbell } from 'lucide-react';

export type ActivityItem = {
    id: string;
    type: 'achievement' | 'friend' | 'match' | 'workout';
    user: {
        name: string;
        avatar: string;
        avatarHint: string;
        profileUrl: string;
    };
    timestamp: string;
    text: string;
    icon: LucideIcon;
};

export const activityFeed: ActivityItem[] = [
    {
        id: 'act-1',
        type: 'achievement',
        user: { name: 'Superuser', avatar: 'https://placehold.co/100x100.png', avatarHint: 'esports player', profileUrl: '/profile' },
        timestamp: '2 часа назад',
        text: 'получил(а) достижение "Первая победа"!',
        icon: Award,
    },
    {
        id: 'act-2',
        type: 'match',
        user: { name: 'Кибер Орлы', avatar: 'https://placehold.co/100x100.png', avatarHint: 'eagle logo', profileUrl: '/teams/cyber-eagles' },
        timestamp: '5 часов назад',
        text: 'победили в матче против "Ледяные Волки" со счетом 13-10.',
        icon: Trophy,
    },
    {
        id: 'act-3',
        type: 'workout',
        user: { name: 'Елена Иванова', avatar: 'https://placehold.co/100x100.png', avatarHint: 'woman fitness', profileUrl: '/administration/player' },
        timestamp: '8 часов назад',
        text: 'завершил(а) тренировку "День 1: Грудь и трицепс".',
        icon: Dumbbell,
    },
    {
        id: 'act-4',
        type: 'friend',
        user: { name: 'ShadowStriker', avatar: 'https://placehold.co/100x100.png', avatarHint: 'esports player', profileUrl: '#' },
        timestamp: '1 день назад',
        text: 'и Superuser теперь друзья.',
        icon: UserPlus,
    },
];
