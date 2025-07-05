import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly foodItemId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly grams: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly meal: string;
}
