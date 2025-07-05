import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMatchDto {
  @ApiProperty({ description: 'Счет команды 1', example: 10 })
  @IsInt({ message: 'Счет должен быть целым числом.' })
  @Min(0, { message: 'Счет не может быть отрицательным.' })
  readonly score1: number;

  @ApiProperty({ description: 'Счет команды 2', example: 5 })
  @IsInt({ message: 'Счет должен быть целым числом.' })
  @Min(0, { message: 'Счет не может быть отрицательным.' })
  readonly score2: number;

  @ApiProperty({ description: 'Комментарий к матчу', required: false, example: 'Напряженная игра!' })
  @IsString()
  @IsOptional()
  readonly comment?: string;
}
