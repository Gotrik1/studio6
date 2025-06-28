import { ClipboardList, TrendingUp, Trophy, Users, Star, Award } from "lucide-react";

export const coachUser = {
  name: 'Тренер Картер',
  email: 'coach.carter@prodvor.com',
  role: 'Тренер',
  avatar: 'https://placehold.co/100x100.png',
};

export const coachAchievements = [
  { name: "Первая победа", icon: Trophy, description: "Привести команду к первой победе на турнире.", unlocked: true },
  { name: "Поиск талантов", icon: Star, description: "Найти и обучить игрока высшего ранга.", unlocked: true },
  { name: "Полный состав", icon: Users, description: "Управлять командой с полным и активным составом в течение сезона.", unlocked: true },
  { name: "Мастер-стратег", icon: ClipboardList, description: "Разработать 10 уникальных выигрышных стратегий.", unlocked: false },
  { name: "Восхождение", icon: TrendingUp, description: "Улучшить ранг команды на 50 позиций.", unlocked: false },
  { name: "Тренер года", icon: Award, description: "Быть избранным Тренером года по мнению сообщества.", unlocked: false },
];
