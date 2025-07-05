import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePracticeDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsDate()
  @Type(() => Date)
  readonly date: Date;

  @IsString()
  @IsNotEmpty()
  readonly playgroundId: string;
}
