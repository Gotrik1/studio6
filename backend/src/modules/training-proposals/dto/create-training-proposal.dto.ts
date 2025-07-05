import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrainingProposalDto {
  @IsString()
  @IsNotEmpty()
  readonly toId: string;

  @IsString()
  @IsNotEmpty()
  readonly sport: string;

  @IsDate()
  @Type(() => Date)
  readonly date: Date;

  @IsString()
  @IsOptional()
  readonly comment?: string;
}
