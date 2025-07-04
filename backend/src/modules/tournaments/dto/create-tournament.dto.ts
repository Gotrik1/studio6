
export class CreateTournamentDto {
    readonly name: string;
    readonly game: string;
    readonly format: 'single_elimination' | 'round_robin';
    readonly prizePool: number;
    readonly startDate: Date;
    readonly description?: string;
    readonly rules?: string;
}
