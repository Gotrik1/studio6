
export interface Rank {
    name: string;
    description: string;
    minPoints: number;
    maxPoints: number;
    color: string; // Tailwind color class
}

export const ranks: Rank[] = [
    { name: "Возьмите меня", description: "только встал с дивана (и уже жалею)", minPoints: 0, maxPoints: 100, color: "text-slate-400" },
    { name: "Уже бегу", description: "первые осознанные попытки (но пока больше падаю)", minPoints: 101, maxPoints: 500, color: "text-gray-500" },
    { name: "Упорный", description: "уже не стыдно (но фото из зала ещё не выкладываю)", minPoints: 501, maxPoints: 1000, color: "text-green-500" },
    { name: "Уличный боец", description: "выживает в любых условиях (особенно после своих же ударов)", minPoints: 1001, maxPoints: 2500, color: "text-sky-500" },
    { name: "Кто ты, воин?", description: "переходный момент: ты ещё не гроза, но уже не просто боец", minPoints: 2501, maxPoints: 3000, color: "text-blue-500" },
    { name: "Гроза района", description: "местный авторитет (но дома всё равно выносит мусор)", minPoints: 3001, maxPoints: 4000, color: "text-indigo-500" },
    { name: "Первый среди равных", description: "эталон для подражания (и зависти)", minPoints: 4001, maxPoints: 6000, color: "text-purple-500" },
    { name: "Познавший дзен", description: "мастерство как философия (и да, он всё ещё злится, когда проигрывает)", minPoints: 6001, maxPoints: 8000, color: "text-pink-500" },
    { name: "Неоспоримый", description: "истина в последней инстанции (и первая в спорах)", minPoints: 8001, maxPoints: 9000, color: "text-red-500" },
    { name: "Первый после бога", description: "на грани человеческого (но всё ещё платит за абонемент)", minPoints: 9001, maxPoints: 9999, color: "text-orange-500" },
    { name: "Анигилятор", description: "абсолютный финал (спортсменов, рекордов и вашей веры в справедливость)", minPoints: 10000, maxPoints: Infinity, color: "text-amber-400" },
];

export const getRankByPoints = (points: number): Rank | undefined => {
    return ranks.find(rank => points >= rank.minPoints && points <= rank.maxPoints);
};
