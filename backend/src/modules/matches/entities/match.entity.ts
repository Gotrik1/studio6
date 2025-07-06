// Представление сущности матча (например, для Prisma или TypeORM)
export class Match {
  id: string;
  team1Id: string;
  team2Id: string;
  score: string;
  status: "planned" | "live" | "finished" | "disputed";
  scheduledAt: Date;
  finishedAt?: Date;
}
