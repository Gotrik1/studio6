import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";

export class AssignSponsorDto {
  @IsString()
  @IsNotEmpty()
  readonly sponsorId: string;

  @IsNumber()
  @Min(0)
  readonly amount: number;
}
