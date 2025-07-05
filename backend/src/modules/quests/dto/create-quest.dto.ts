import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsEnum, IsNotEmpty } from 'class-validator';
import { QuestType } from '@prisma/client';

export class CreateQuestDto {
  @ApiProperty({ description: 'Название квеста' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: 'Описание квеста' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ description: 'Награда в PD' })
  @IsInt()
  @Min(0)
  readonly reward: number;

  @ApiProperty({ description: 'Цель для выполнения' })
  @IsInt()
  @Min(1)
  readonly goal: number;
  
  @ApiProperty({ description: 'Ссылка для выполнения' })
  @IsString()
  @IsNotEmpty()
  readonly href: string;

  @ApiProperty({ enum: QuestType, description: 'Тип квеста' })
  @IsEnum(QuestType)
  readonly type: QuestType;
}
