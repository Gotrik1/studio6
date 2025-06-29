
export const RANKS = [
    { name: "Возьмите меня", minPoints: 0, maxPoints: 100, title: "только встал с дивана (и уже жалею)", color: "text-gray-400" },
    { name: "Уже бегу", minPoints: 101, maxPoints: 500, title: "первые осознанные попытки (но пока больше падаю)", color: "text-stone-500" },
    { name: "Упорный", minPoints: 501, maxPoints: 1000, title: "уже не стыдно (но фото в зал ещё не выкладываю)", color: "text-green-500" },
    { name: "Уличный боец", minPoints: 1001, maxPoints: 2500, title: "выживает в любых условиях (особенно после своих же ударов)", color: "text-cyan-500" },
    { name: "Кто ты, воин?", minPoints: 2501, maxPoints: 3000, title: "переходный момент: ты ещё не гроза, но уже не просто боец", color: "text-blue-500" },
    { name: "Гроза района", minPoints: 3001, maxPoints: 4000, title: "местный авторитет (но дома всё равно выносит мусор)", color: "text-indigo-500" },
    { name: "Первый среди равных", minPoints: 4001, maxPoints: 6000, title: "эталон для подражания (и зависти)", color: "text-purple-500" },
    { name: "Познавший дзен", minPoints: 6001, maxPoints: 8000, title: "мастерство как философия (и да, он всё ещё злится, когда проигрывает)", color: "text-pink-500" },
    { name: "Неоспоримый", minPoints: 8001, maxPoints: 9000, title: "истина в последней инстанции (и первая в спорах)", color: "text-red-500" },
    { name: "Первый после бога", minPoints: 9001, maxPoints: 9999, title: "на грани человеческого (но всё ещё платит за абонемент)", color: "text-orange-500" },
    { name: "Анигилятор", minPoints: 10000, maxPoints: Infinity, title: "абсолютный финал (спортсменов, рекордов и вашей веры в справедливость)", color: "text-amber-400" },
];

export const getRankByPoints = (points: number) => {
    const rank = RANKS.find(r => points >= r.minPoints && points <= r.maxPoints);
    return rank || RANKS[0]; // Fallback to the first rank
};
