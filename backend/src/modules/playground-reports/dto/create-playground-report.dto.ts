import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePlaygroundReportDto {
  @IsString()
  @IsNotEmpty()
  readonly playgroundId: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;
}
