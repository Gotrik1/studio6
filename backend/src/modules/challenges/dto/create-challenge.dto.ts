import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ description: 'Название вызова', example: 'Дуэль на AWP 1v1' })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  readonly title: string;

  @ApiProperty({ description: 'Описание вызова', example: 'Ищу сильного снайпера для дуэли на карте awp_lego.' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  readonly description: string;
  
  @ApiProperty({ description: 'ID дисциплины', example: 'csgo' })
  @IsString()
  @IsNotEmpty()
  readonly disciplineId: string;

  @ApiProperty({ description: 'Ставка в PD', example: 100 })
  @IsInt()
  @Min(0)
  @Max(10000)
  readonly wager: number;
}
