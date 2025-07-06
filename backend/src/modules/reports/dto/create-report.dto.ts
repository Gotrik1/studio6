import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  readonly reportedUserId: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
