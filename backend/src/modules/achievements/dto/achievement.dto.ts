import { ApiProperty } from "@nestjs/swagger";

export class AchievementDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  unlocked: boolean;
}
