import { IsString, MinLength } from 'class-validator';

export class CreateStatusActivityDto {
  @IsString()
  @MinLength(1)
  readonly text: string;
}
