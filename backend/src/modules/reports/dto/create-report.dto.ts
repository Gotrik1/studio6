import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  readonly reportedUserId: string;

  @IsString()
  @IsNotEmpty()
  readonly reason: string;

  @IsString()
  @IsNotEmpty()
  readonly context: string;
}
