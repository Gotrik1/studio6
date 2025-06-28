import { Handshake, Megaphone, DollarSign, Target, Users, Award } from "lucide-react";

export const sponsorUser = {
  name: 'Sponsor Corp',
  email: 'contact@sponsorcorp.com',
  role: 'Спонсор',
  avatar: 'https://placehold.co/100x100.png',
};

export const sponsorAchievements = [
  { name: "Первое партнерство", icon: Handshake, description: "Спонсировать свою первую команду или турнир.", unlocked: true },
  { name: "Мастер кампаний", icon: Megaphone, description: "Провести успешную рекламную кампанию с более чем 1 млн показов.", unlocked: false },
  { name: "Инвестор сообщества", icon: Users, description: "Спонсировать 5 различных команд сообщества.", unlocked: true },
  { name: "Крупный игрок", icon: DollarSign, description: "Внести более $20,000 в призовые фонды.", unlocked: false },
  { name: "Строитель бренда", icon: Target, description: "Достичь 20% увеличения узнаваемости бренда.", unlocked: false },
  { name: "Спонсор года", icon: Award, description: "Быть избранным Спонсором года по мнению сообщества.", unlocked: false },
];
