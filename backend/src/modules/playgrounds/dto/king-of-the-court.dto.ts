import { ApiProperty } from "@nestjs/swagger";

export class KingOfTheCourtDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  logo: string | null;

  @ApiProperty({ nullable: true })
  dataAiHint: string | null;

  @ApiProperty()
  game: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  wins: number;
}
