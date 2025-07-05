import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignProgramDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly programId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  readonly playerIds: string[];
}
