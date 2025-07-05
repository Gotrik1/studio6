import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCheckInDto {
  @IsString()
  @IsNotEmpty()
  readonly playgroundId: string;

  @IsString()
  @IsOptional()
  readonly comment?: string;

  @IsString()
  @IsOptional()
  readonly photo?: string; // base64 data URI
}
