import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class StoreItemDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
  
  @IsNumber()
  readonly price: number;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsString()
  @IsOptional()
  readonly imageHint?: string;

  @IsString()
  readonly category: string;
  
  @IsBoolean()
  readonly isRealMoney: boolean;
}
