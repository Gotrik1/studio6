// Представление сущности пользователя (например, для Prisma или TypeORM)
export class User {
    id: string;
    name: string;
    email: string;
    role: string;
    passwordHash: string;
}
