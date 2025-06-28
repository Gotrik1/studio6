import { Trophy, CalendarPlus, Users, ClipboardList, Star, Award } from "lucide-react";

export const organizerUser = {
    name: 'Event Horizon Inc.',
    email: 'events@horizon.com',
    role: 'Организатор',
    avatar: 'https://placehold.co/100x100.png',
};

export const organizerAchievements = [
  { name: "Первое событие", icon: "CalendarPlus", description: "Успешно организовать свой первый турнир.", unlocked: true },
  { name: "Полная сетка", icon: "Users", description: "Провести турнир с полной сеткой на 64 команды.", unlocked: false },
  { name: "Любимец сообщества", icon: "Star", description: "Организовать событие, оцененное участниками на 5 звезд.", unlocked: true },
  { name: "Крупный организатор", icon: "Trophy", description: "Провести турнир с призовым фондом более $10,000.", unlocked: false },
  { name: "Безупречная работа", icon: "ClipboardList", description: "Провести турнир без единого спора или проблемы.", unlocked: false },
  { name: "Организатор года", icon: "Award", description: "Быть избранным Организатором года.", unlocked: false },
];
