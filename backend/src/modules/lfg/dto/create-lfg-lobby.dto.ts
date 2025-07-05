import { ApiProperty } from '@nestjs/swagger';
import { LfgLobbyType } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsInt, Min, Max, IsDate, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLfgLobbyDto {
  @ApiProperty({ enum: LfgLobbyType })
  @IsEnum(LfgLobbyType)
  readonly type: LfgLobbyType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly sport: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly location: string;
  
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly playgroundId?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly startTime: Date;
  
  @ApiProperty()
  @IsInt()
  @Min(30)
  @Max(240)
  readonly duration: number; // Duration in minutes

  @ApiProperty()
  @IsInt()
  @Min(2)
  @Max(22)
  readonly playersNeeded: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly comment: string;
}
