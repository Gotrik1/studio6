import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty()
  @IsDateString()
  readonly purchaseDate: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly lifespanMonths: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly imageHint?: string;
}
