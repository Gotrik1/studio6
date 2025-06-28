
export const matchesToReview = [
  {
    id: 'match-rev-1',
    team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', logoHint: 'eagle logo' },
    team2: { name: 'Стальные Титаны', logo: 'https://placehold.co/40x40.png', logoHint: 'robot titan' },
    score: '13-10',
    tournament: 'Autumn Cyber Clash - Группа A',
    submittedBy: "Alex 'CyberSlasher' Doe",
    timestamp: '2 часа назад'
  },
  {
    id: 'match-rev-2',
    team1: { name: 'Призрачные Волки', logo: 'https://placehold.co/40x40.png', logoHint: 'wolf logo' },
    team2: { name: 'Теневые Коты', logo: 'https://placehold.co/40x40.png', logoHint: 'cat logo' },
    score: '13-11',
    tournament: 'City League - Неделя 2',
    submittedBy: "Yuri 'Ghost' Volkov",
    timestamp: 'Вчера в 22:45'
  },
];

export const disputedMatches = [
  {
    id: 'match-disp-1',
    team1: { name: 'Вихревые Гадюки', logo: 'https://placehold.co/40x40.png', logoHint: 'snake logo' },
    team2: { name: 'Квантовые Квазары', logo: 'https://placehold.co/40x40.png', logoHint: 'galaxy logo' },
    score: '9-13',
    tournament: 'Summer Kickoff 2024 - Полуфинал',
    reason: 'Подозрение в использовании стороннего ПО игроком "Nova"',
    status: 'Ожидает решения'
  },
  {
    id: 'match-disp-2',
    team1: { name: 'Багровые Крестоносцы', logo: 'https://placehold.co/40x40.png', logoHint: 'knight logo' },
    team2: { name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', logoHint: 'dragon logo' },
    score: '7-13',
    tournament: 'Summer Kickoff 2024 - Полуфинал',
    reason: 'Несоответствие заявленного состава фактическому',
    status: 'Изучается'
  },
];

export const mySchedule = [
    {
        id: 'match-sch-1',
        team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', logoHint: 'eagle logo' },
        team2: { name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', logoHint: 'dragon logo' },
        time: 'Сегодня, 19:00',
        tournament: 'Autumn Cyber Clash - Финал',
        status: 'Предстоящий',
    },
    {
        id: 'match-sch-2',
        team1: { name: 'Красные Ястребы', logo: 'https://placehold.co/40x40.png', logoHint: 'hawk logo' },
        team2: { name: 'Синие Акулы', logo: 'https://placehold.co/40x40.png', logoHint: 'shark logo' },
        time: 'Завтра, 20:00',
        tournament: 'City League - Неделя 3',
        status: 'Предстоящий',
    }
];
