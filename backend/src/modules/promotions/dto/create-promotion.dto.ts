import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly prize: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly cost: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly imageDataUri: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly imageHint: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly sponsorId?: string;

  @ApiProperty()
  @IsDateString()
  readonly endDate: Date;
}
