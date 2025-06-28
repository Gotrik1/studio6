
export const matchData = {
  id: 'cyber-eagles-vs-ice-dragons',
  team1: { name: "Кибер Орлы", logo: "https://placehold.co/128x128.png", logoHint: "eagle logo" },
  team2: { name: "Ледяные Драконы", logo: "https://placehold.co/128x128.png", logoHint: "dragon logo" },
  score: "2-1",
  tournament: "Summer Kickoff 2024 - Финал",
  status: "Завершен",
  date: "17 августа 2024",
  time: "19:00",
  location: "Арена 'Колизей'",
  referee: { name: "Судья Джуди", profileUrl: "/administration/judge" },
  events: [
    { time: "15'", event: "Гол", player: "Alex 'CyberSlasher' Doe", team: "Кибер Орлы" },
    { time: "32'", event: "Желтая карточка", player: "Dmitry 'Gadget' Kuznetsov", team: "Кибер Орлы" },
    { time: "55'", event: "Гол", player: "Frosty", team: "Ледяные Драконы" },
    { time: "89'", event: "Победный гол", player: "Maria 'Shadow' Petrova", team: "Кибер Орлы" },
  ],
  teamStats: {
    possession: { team1: 58, team2: 42, label: "Владение мячом" },
    shots: { team1: 14, team2: 9, label: "Удары" },
    shotsOnTarget: { team1: 8, team2: 5, label: "Удары в створ" },
    corners: { team1: 6, team2: 3, label: "Угловые" },
    fouls: { team1: 12, team2: 15, label: "Фолы" },
  },
  lineups: {
    team1: [
      { name: "Alex 'CyberSlasher' Doe", role: "Дуэлянт", avatar: "https://placehold.co/100x100.png", avatarHint: "esports player" },
      { name: "Maria 'Shadow' Petrova", role: "Смоукер", avatar: "https://placehold.co/100x100.png", avatarHint: "female gamer" },
      { name: "Ivan 'Beast' Orlov", role: "Страж", avatar: "https://placehold.co/100x100.png", avatarHint: "focused gamer" },
    ],
    team2: [
      { name: "Frosty", role: "Дуэлянт", avatar: "https://placehold.co/100x100.png", avatarHint: "gamer winter" },
      { name: "IceQueen", role: "Страж", avatar: "https://placehold.co/100x100.png", avatarHint: "ice queen" },
      { name: "Blizzard", role: "Смоукер", avatar: "https://placehold.co/100x100.png", avatarHint: "snow storm" },
    ]
  },
  media: [
    { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'esports winner' },
    { type: 'video', src: 'https://placehold.co/600x400.png', hint: 'esports highlights' },
    { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'team celebration' },
    { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'esports crowd' },
  ]
};

export type MatchDetails = typeof matchData;

export const getMatchById = (id: string): MatchDetails | null => {
    // In a real app, you would fetch this from an API or database.
    if (id === matchData.id) {
        return matchData;
    }
    return null;
}
