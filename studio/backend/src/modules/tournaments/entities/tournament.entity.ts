// Представление сущности турнира (например, для Prisma или TypeORM)
export class Tournament {
    id: string;
    name: string;
    game: string;
    status: 'registration' | 'ongoing' | 'finished';
    teams: string[]; // array of team IDs
}
