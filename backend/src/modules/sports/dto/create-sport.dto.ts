import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly icon: string;

  @ApiProperty({ enum: ['Командный', 'Некомандный', 'Киберспорт'] })
  @IsIn(['Командный', 'Некомандный', 'Киберспорт'])
  readonly category: 'Командный' | 'Некомандный' | 'Киберспорт';
}
