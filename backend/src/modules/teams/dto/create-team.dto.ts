export class CreateTeamDto {
  readonly name: string;
  readonly captainId: string;
  readonly game: string;
  readonly motto?: string;
  readonly description?: string;
  readonly logo?: string;
  readonly dataAiHint?: string;
}
