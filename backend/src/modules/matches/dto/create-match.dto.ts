
export class CreateMatchDto {
    readonly team1Id: string;
    readonly team2Id: string;
    readonly tournamentId?: string;
    readonly scheduledAt: Date;
}
