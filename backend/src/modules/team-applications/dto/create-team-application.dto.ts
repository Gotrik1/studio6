import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTeamApplicationDto {
  @IsString()
  @IsNotEmpty()
  readonly teamId: string;

  @IsString()
  @IsOptional()
  readonly message?: string;
}
