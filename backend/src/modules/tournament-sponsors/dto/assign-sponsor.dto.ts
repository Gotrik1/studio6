import { IsString, IsNotEmpty } from 'class-validator';

export class AssignSponsorDto {
  @IsString()
  @IsNotEmpty()
  readonly sponsorId: string;
}
