import { Shield, Server, BarChart3, Users, Gavel, ArrowUpCircle } from "lucide-react";

export const adminUser = {
  name: 'Admin User',
  email: 'admin.user@prodvor.com',
  role: 'Администратор',
  avatar: 'https://placehold.co/100x100.png',
};

export const adminAchievements = [
  { name: "Первое обновление системы", icon: ArrowUpCircle, description: "Успешно развернуть обновление системы.", unlocked: true },
  { name: "Хранитель сообщества", icon: Shield, description: "Рассмотреть 100 жалоб пользователей.", unlocked: true },
  { name: "Рост платформы", icon: Users, description: "Достичь 1000 активных пользователей.", unlocked: true },
  { name: "Первый банхаммер", icon: Gavel, description: "Принять первое модераторское решение.", unlocked: true },
  { name: "Стабильность сервера", icon: Server, description: "Поддерживать 99.9% времени безотказной работы в течение месяца.", unlocked: false },
  { name: "Поставщик фич", icon: BarChart3, description: "Проконтролировать запуск 5 крупных функций.", unlocked: false },
];
