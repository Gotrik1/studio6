
export const summerKickoffTournament = {
  name: "Summer Kickoff 2024",
  slug: "summer-kickoff",
  description: "Главный Valorant турнир этого лета!",
  status: "Идет",
  bannerImage: "https://placehold.co/1200x400.png",
  bannerImageHint: "esports gaming",
  participants: [
    { id: 1, name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', dataAiHint: "eagle logo", status: 'Оплачено', captain: "Alex 'CyberSlasher' Doe", profileUrl: '/teams/cyber-eagles' },
    { id: 2, name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', dataAiHint: "dragon logo", status: 'Оплачено', captain: "Frosty", profileUrl: '#' },
    { id: 3, name: 'Квантовые Квазары', logo: 'https://placehold.co/40x40.png', dataAiHint: "galaxy logo", status: 'Ожидает оплаты', captain: "Alex 'Nova' Ray", profileUrl: '#' },
    { id: 4, name: 'Багровые Крестоносцы', logo: 'https://placehold.co/40x40.png', dataAiHint: "knight logo", status: 'Оплачено', captain: "Sam 'The-Rock' Stone", profileUrl: '#' },
    { id: 5, name: 'Стальные Титаны', logo: 'https://placehold.co/40x40.png', dataAiHint: "robot titan", status: 'Проблема с оплатой', captain: "Max 'Titan' Iron", profileUrl: '#' },
    { id: 6, name: 'Вихревые Гадюки', logo: 'https://placehold.co/40x40.png', dataAiHint: "snake logo", status: 'Оплачено', captain: "Jane 'Venom' Doe", profileUrl: '#' },
    { id: 7, name: 'Призрачные Волки', logo: 'https://placehold.co/40x40.png', dataAiHint: "wolf logo", status: 'Оплачено', captain: "Yuri 'Ghost' Volkov", profileUrl: '#' },
    { id: 8, name: 'Теневые Коты', logo: 'https://placehold.co/40x40.png', dataAiHint: "cat logo", status: 'Оплачено', captain: "Luna 'Shadow' Meow", profileUrl: '#' },
  ],
  bracketData: {
    rounds: [
      {
        name: 'Четвертьфиналы',
        matches: [
          { id: 1, team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'eagle logo' }, team2: { name: 'Стальные Титаны', logo: 'https://placehold.co/40x40.png', dataAiHint: 'robot titan' }, score: '13-8' },
          { id: 2, team1: { name: 'Вихревые Гадюки', logo: 'https://placehold.co/40x40.png', dataAiHint: 'snake logo' }, team2: { name: 'Квантовые Квазары', logo: 'https://placehold.co/40x40.png', dataAiHint: 'galaxy logo' }, score: '9-13' },
          { id: 3, team1: { name: 'Багровые Крестоносцы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'knight logo' }, team2: { name: 'Призрачные Волки', logo: 'https://placehold.co/40x40.png', dataAiHint: 'wolf logo' }, score: '13-5' },
          { id: 4, team1: { name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'dragon logo' }, team2: { name: 'Теневые Коты', logo: 'https://placehold.co/40x40.png', dataAiHint: 'cat logo' }, score: '13-11' },
        ],
      },
      {
        name: 'Полуфиналы',
        matches: [
          { id: 5, team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'eagle logo' }, team2: { name: 'Квантовые Квазары', logo: 'https://placehold.co/40x40.png', dataAiHint: 'galaxy logo' }, score: '13-10' },
          { id: 6, team1: { name: 'Багровые Крестоносцы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'knight logo' }, team2: { name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'dragon logo' }, score: '7-13' },
        ],
      },
      {
        name: 'Финал',
        matches: [
          { id: 7, team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'eagle logo' }, team2: { name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'dragon logo' }, score: '2-1', href: '/match-details' },
        ],
      },
       {
        name: 'Чемпион',
        matches: [
          { id: 8, team1: { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', dataAiHint: 'eagle logo' }, winner: true },
        ],
      },
    ],
  },
  schedule: [
    { stage: 'Четвертьфиналы', date: '15 августа 2024' },
    { stage: 'Полуфиналы', date: '16 августа 2024' },
    { stage: 'Финал', date: '17 августа 2024' },
  ],
  prizes: [
    { place: '1 место', reward: '$2,500 + эксклюзивный скин', color: 'text-amber-400' },
    { place: '2 место', reward: '$1,500', color: 'text-gray-400' },
    { place: '3-4 место', reward: '$500', color: 'text-orange-400' },
  ],
  sponsors: [
    { name: "Sponsor 1", logo: "https://placehold.co/150x50.png", logoHint: 'corporate logo' },
    { name: "Sponsor 2", logo: "https://placehold.co/150x50.png", logoHint: 'gaming brand logo' },
    { name: "Sponsor 3", logo: "https://placehold.co/150x50.png", logoHint: 'beverage logo' },
  ]
};

export type TournamentDetails = typeof summerKickoffTournament;

export function getTournamentBySlug(slug: string): TournamentDetails | null {
    // In a real app, this would look up the tournament in a database.
    // For now, we only have one, so we return it if the slug matches.
    if (slug === summerKickoffTournament.slug) {
        return summerKickoffTournament;
    }
    return null;
}
