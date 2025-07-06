import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTournamentMediaDto {
  @ApiProperty()
  @IsString()
  @IsIn(["IMAGE", "VIDEO", "AUDIO"])
  readonly type: "IMAGE" | "VIDEO" | "AUDIO";

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly src: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly hint?: string;
}
