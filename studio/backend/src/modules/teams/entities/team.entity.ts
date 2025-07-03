// Представление сущности команды (например, для Prisma или TypeORM)
export class Team {
    id: string;
    name: string;
    captainId: string;
    game: string;
    members: string[]; // array of user IDs
}
