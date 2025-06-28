import { Swords, MessageCircle, Crown, ShoppingCart, UserPlus, Trophy, type LucideIcon } from "lucide-react";

export type Quest = {
  id: string;
  title: string;
  description: string;
  reward: number;
  goal: number;
  currentProgress: number;
  isClaimed: boolean;
  type: 'daily' | 'weekly' | 'event';
  icon: LucideIcon;
};

export const dailyQuests: Quest[] = [
    {
        id: 'daily-1',
        title: 'Три матча',
        description: 'Сыграйте 3 матча в любом режиме.',
        reward: 25,
        goal: 3,
        currentProgress: 2,
        isClaimed: false,
        type: 'daily',
        icon: Swords,
    },
    {
        id: 'daily-2',
        title: 'Общительный',
        description: 'Оставьте 5 комментариев в новостной ленте.',
        reward: 10,
        goal: 5,
        currentProgress: 5,
        isClaimed: false,
        type: 'daily',
        icon: MessageCircle,
    },
    {
        id: 'daily-3',
        title: 'Капитан Америка',
        description: 'Одержите победу в качестве капитана команды.',
        reward: 50,
        goal: 1,
        currentProgress: 0,
        isClaimed: false,
        type: 'daily',
        icon: Crown,
    }
];

export const weeklyQuests: Quest[] = [
    {
        id: 'weekly-1',
        title: 'Шопоголик',
        description: 'Потратьте 500 PD в магазине.',
        reward: 100,
        goal: 500,
        currentProgress: 150,
        isClaimed: false,
        type: 'weekly',
        icon: ShoppingCart,
    },
    {
        id: 'weekly-2',
        title: 'Вербовщик',
        description: 'Пригласите 2 новых игроков в свою команду.',
        reward: 150,
        goal: 2,
        currentProgress: 1,
        isClaimed: false,
        type: 'weekly',
        icon: UserPlus,
    }
];

export const eventQuests: Quest[] = [
    {
        id: 'event-1',
        title: 'Участник Autumn Clash',
        description: 'Зарегистрируйтесь на турнир Autumn Cyber Clash 2024.',
        reward: 75,
        goal: 1,
        currentProgress: 0,
        isClaimed: false,
        type: 'event',
        icon: Trophy,
    }
];
