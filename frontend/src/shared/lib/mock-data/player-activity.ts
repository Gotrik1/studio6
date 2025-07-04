import { Trophy, Award, Dumbbell, Users, UserPlus } from 'lucide-react';

export const playerActivity = [
    {
        id: 'pa-1',
        type: 'match_played',
        icon: Trophy,
        text: 'Сыграл матч за <a href="/teams/dvotovyie-atlety" class="font-bold hover:underline">Дворовые Атлеты</a> против <a href="#" class="font-bold hover:underline">Торпедо</a>. <span class="text-green-500 font-bold">Победа 5-3</span>.',
        timestamp: '1 день назад',
    },
    {
        id: 'pa-2',
        type: 'achievement_unlocked',
        icon: Award,
        text: 'Разблокировал достижение <span class="font-bold">Первая победа</span>.',
        timestamp: '1 день назад',
    },
    {
        id: 'pa-3',
        type: 'workout_completed',
        icon: Dumbbell,
        text: 'Завершил тренировку <a href="/training/log" class="font-bold hover:underline">День 2: Спина и бицепс</a>.',
        timestamp: '2 дня назад',
    },
    {
        id: 'pa-4',
        type: 'team_joined',
        icon: Users,
        text: 'Вступил в команду <a href="/teams/sokoly" class="font-bold hover:underline">Соколы</a>.',
        timestamp: '5 дней назад',
    },
    {
        id: 'pa-5',
        type: 'friend_added',
        icon: UserPlus,
        text: 'Стал друзьями с <a href="/profiles/player/friend-1" class="font-bold hover:underline">Echo</a>.',
        timestamp: '6 дней назад',
    },
];

export type PlayerActivityItem = (typeof playerActivity)[0];
