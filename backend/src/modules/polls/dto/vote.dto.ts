import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty({ description: 'ID выбранной опции' })
  @IsString()
  @IsNotEmpty()
  readonly optionId: string;
}
