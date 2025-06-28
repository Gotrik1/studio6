import { MessageCircle, Shield, UserPlus, Trophy, Star, Users } from 'lucide-react';

export const notifications = [
  {
    id: 'notif-1',
    type: 'new_message',
    icon: MessageCircle,
    title: "Новое сообщение от Тренера Картера",
    description: "Отличная игра сегодня, горжусь вами!",
    timestamp: "5 минут назад",
    isRead: false,
    href: '/chats'
  },
  {
    id: 'notif-6',
    type: 'team_invite',
    icon: Users,
    title: "Приглашение в команду",
    description: "Команда 'Кибер Орлы' приглашает вас присоединиться к составу.",
    timestamp: "10 минут назад",
    isRead: false,
    href: '/teams/cyber-eagles'
  },
  {
    id: 'notif-2',
    type: 'match_invite',
    icon: Shield,
    title: "Вам брошен вызов!",
    description: "Команда 'Вихревые Гадюки' вызывает вас на матч.",
    timestamp: "1 час назад",
    isRead: false,
    href: '/matches'
  },
  {
    id: 'notif-3',
    type: 'friend_request',
    icon: UserPlus,
    title: "Новая заявка в друзья",
    description: "Пользователь 'Frosty' хочет добавить вас в друзья.",
    timestamp: "3 часа назад",
    isRead: true,
    href: '/profile'
  },
  {
    id: 'notif-4',
    type: 'tournament_start',
    icon: Trophy,
    title: "Турнир начинается!",
    description: "Autumn Cyber Clash вот-вот начнется. Удачи!",
    timestamp: "Вчера",
    isRead: true,
    href: '/tournaments'
  },
  {
    id: 'notif-5',
    type: 'achievement_unlocked',
    icon: Star,
    title: "Новое достижение",
    description: "Вы разблокировали достижение 'Железный человек'.",
    timestamp: "2 дня назад",
    isRead: true,
    href: '/leaderboards'
  }
];

export type Notification = typeof notifications[0];
