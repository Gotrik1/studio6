
import { Trophy, CheckCircle, XCircle, Bot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const teamRoster = [
    { id: 1, name: 'Superuser', role: 'Капитан / IGL', rating: 'Immortal 3', status: 'Онлайн', avatar: 'https://placehold.co/100x100.png' },
    { id: 2, name: 'Echo', role: 'Дуэлянт', rating: 'Immortal 2', status: 'Онлайн', avatar: 'https://placehold.co/100x100.png' },
    { id: 3, name: 'Viper', role: 'Страж', rating: 'Immortal 2', status: 'В игре', avatar: 'https://placehold.co/100x100.png' },
    { id: 4, name: 'Reaper', role: 'Зачинщик', rating: 'Immortal 1', status: 'Отошел', avatar: 'https://placehold.co/100x100.png' },
    { id: 5, name: 'Blaze', role: 'Специалист', rating: 'Ascendant 3', status: 'Оффлайн', avatar: 'https://placehold.co/100x100.png' },
];

export const teamActivity: { id: number; icon: LucideIcon; text: string; timestamp: string; }[] = [
    { id: 1, icon: Trophy, text: 'Победа в матче против "Ледяные Волки" со счетом 13-10.', timestamp: '2 часа назад' },
    { id: 2, icon: CheckCircle, text: 'Игрок "Echo" подтвердил участие в завтрашней тренировке.', timestamp: '5 часов назад' },
    { id: 3, icon: Bot, text: 'AI-ассистент сгенерировал новый план тренировок.', timestamp: '8 часов назад' },
    { id: 4, icon: XCircle, text: 'Поражение в матче против "Теневые Лисы" со счетом 8-13.', timestamp: '1 день назад' },
];
export type TeamActivity = (typeof teamActivity)[0];

export const challenges = {
    incoming: [
        { 
            id: 1, 
            opponent: { name: 'Стальные Титаны', logo: 'https://placehold.co/100x100.png', logoHint: 'titan logo' },
            time: '28 июля, 20:00',
            venue: 'Онлайн',
        }
    ],
    outgoing: [
         { 
            id: 2, 
            opponent: { name: 'Ледяные Волки', logo: 'https://placehold.co/100x100.png', logoHint: 'wolf logo' },
            status: 'Ожидание',
        }
    ]
};
