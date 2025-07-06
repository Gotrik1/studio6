import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty()
  @Min(5, { message: "Название должно быть не менее 5 символов." })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly game: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsEnum(["team", "individual"])
  readonly type: "team" | "individual";

  @IsEnum(["single_elimination", "round_robin", "groups"])
  readonly format: "single_elimination" | "round_robin" | "groups";

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsInt()
  @Min(4)
  @Max(128)
  readonly participantCount: number;

  @IsDate()
  @Type(() => Date)
  readonly registrationStartDate: Date;

  @IsDate()
  @Type(() => Date)
  readonly registrationEndDate: Date;

  @IsDate()
  @Type(() => Date)
  readonly tournamentStartDate: Date;

  @IsString()
  @IsOptional()
  readonly prizePool?: string;

  @IsString()
  @IsOptional()
  readonly rules?: string;

  @IsString()
  @IsOptional()
  readonly bannerImage?: string;

  @IsString()
  @IsOptional()
  readonly bannerImageHint?: string;
}
