import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePlaygroundDto {
  @ApiProperty({ description: 'Название площадки' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
  
  @ApiProperty({ description: 'Адрес' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  address: string;
  
  @ApiProperty({ description: 'Тип площадки' })
  @IsString()
  @IsNotEmpty()
  type: string;
  
  @ApiProperty({ description: 'Тип покрытия' })
  @IsString()
  @IsNotEmpty()
  surface: string;

  @ApiProperty({ description: 'Доступные удобства', type: [String] })
  @IsArray()
  @IsString({ each: true })
  features: string[];
  
  @ApiProperty({ description: 'URL изображения', required: false })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ description: 'Подсказка для AI для изображения', required: false })
  @IsString()
  @IsOptional()
  coverImageHint?: string;
}
