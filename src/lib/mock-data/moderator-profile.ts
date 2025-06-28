import { Gavel, Shield, MessageSquareX, UserX, UserCheck, Eye } from "lucide-react";

export const moderatorUser = {
  name: 'Модератор Макс',
  email: 'max.mod@prodvor.com',
  role: 'Модератор',
  avatar: 'https://placehold.co/100x100.png',
};

export const moderatorAchievements = [
  { name: "Первое решение", icon: 'Gavel', description: "Рассмотреть свою первую жалобу на контент.", unlocked: true },
  { name: "Миротворец", icon: 'Shield', description: "Успешно разрешить 50 споров.", unlocked: true },
  { name: "Активный наблюдатель", icon: 'Eye', description: "Просмотреть 1000 единиц контента.", unlocked: true },
  { name: "Чистая работа", icon: 'MessageSquareX', description: "Обработать 100 жалоб за один день.", unlocked: false },
  { name: "Повышение пользователя", icon: 'UserCheck', description: "Повысить пользователя до доверенной роли.", unlocked: true },
  { name: "Вечный бан", icon: 'UserX', description: "Выдать постоянный бан за серьезное нарушение.", unlocked: false },
];
