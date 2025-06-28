import { Award, Users, Trophy, Target, Medal, Star, Gavel, ClipboardCheck, CalendarDays, Shield, Scale } from "lucide-react";

export const achievements = [
  { name: "Лучший новичок", icon: Award, description: "Выиграть награду лучшего новичка сезона.", unlocked: true },
  { name: "Золотая нога", icon: Star, description: "Забить 50 голов за сезон.", unlocked: true },
  { name: "Чемпион турнира", icon: Trophy, description: "Выиграть крупный турнир.", unlocked: false },
  { name: "Топ-10 города", icon: Target, description: "Войти в топ-10 игроков своего города.", unlocked: true },
  { name: "Железный человек", icon: Medal, description: "Сыграть 100 матчей без замен.", unlocked: false },
  { name: "Командный игрок", icon: Users, description: "Отдать 50 голевых передач.", unlocked: true },
];

export const teams = [
  { name: "Кибер Орлы", role: "Капитан", logo: "https://placehold.co/128x128.png", dataAiHint: "eagle logo" },
  { name: "Ночные Охотники", role: "Игрок", logo: "https://placehold.co/128x128.png", dataAiHint: "wolf logo" },
];

export const recentMatches = [
  { id: 1, teamA: "Кибер Орлы", scoreA: 13, teamB: "Вихревые Гадюки", scoreB: 9, result: "victory", game: "Valorant", map: "Ascent" },
  { id: 2, teamA: "Кибер Орлы", scoreA: 7, teamB: "Квантовые Квазары", scoreB: 13, result: "defeat", game: "Valorant", map: "Bind" },
  { id: 3, teamA: "Ночные Охотники", scoreA: 16, teamB: "Багровые Крестоносцы", scoreB: 14, result: "victory", game: "CS:GO 2", map: "Mirage" },
];

export const gallery = [
    { src: "https://placehold.co/600x400.png", alt: "Момент с турнира", dataAiHint: "esports gaming" },
    { src: "https://placehold.co/600x400.png", alt: "Командное фото", dataAiHint: "team photo" },
    { src: "https://placehold.co/600x400.png", alt: "Победный крик", dataAiHint: "celebration gaming" },
    { src: "https://placehold.co/600x400.png", alt: "Клатч-момент", dataAiHint: "intense gaming" },
];

export const careerHistory = [
    { teamName: "Юниоры 'Пламя'", period: "2018 - 2020", role: "Нападающий", review: "Отличный старт карьеры, показал себя как перспективный игрок." },
    { teamName: "Городская лига 'Вымпел'", period: "2020 - 2022", role: "Полузащитник", review: "Стал ключевым игроком центра поля, много работал над выносливостью." },
    { teamName: "Кибер Орлы", period: "2022 - н.в.", role: "Капитан", review: "Взял на себя лидерские функции, привел команду к нескольким победам в региональных турнирах." },
];

export const judgeUser = {
  name: 'Судья Джуди',
  email: 'judy.j@prodvor.com',
  role: 'Судья',
  avatar: 'https://placehold.co/100x100.png',
};

export const judgeAchievements = [
  { name: "Первое судейство", icon: Gavel, description: "Отсудить свой первый официальный матч.", unlocked: true },
  { name: "Турнирный судья", icon: Trophy, description: "Работать судьей на крупном турнире.", unlocked: true },
  { name: "Железный судья", icon: CalendarDays, description: "Отсудить 50 матчей за один сезон.", unlocked: true },
  { name: "Награда за честную игру", icon: Shield, description: "Получить рейтинг справедливости 99%+ от игроков.", unlocked: false },
  { name: "Разрешитель споров", icon: Scale, description: "Успешно разрешить 20 споров по счету.", unlocked: false },
  { name: "Сертифицированный профи", icon: ClipboardCheck, description: "Пройти профессиональную сертификацию судей.", unlocked: true },
];