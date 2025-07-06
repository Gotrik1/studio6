import { IsDateString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreateMeasurementDto {
  @IsDateString()
  readonly date: string;

  @IsNumber()
  @Min(30)
  @Max(300)
  readonly weight: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(70)
  readonly bodyFat?: number;

  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(200)
  readonly chest?: number;

  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(200)
  readonly waist?: number;

  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(200)
  readonly hips?: number;

  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(100)
  readonly biceps?: number;

  @IsNumber()
  @IsOptional()
  @Min(20)
  @Max(150)
  readonly thigh?: number;
}
