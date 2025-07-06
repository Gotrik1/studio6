import { ApiProperty } from "@nestjs/swagger";

export class CoachDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  avatar: string | null;

  @ApiProperty()
  avatarHint: string;

  @ApiProperty()
  specialization: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  experience: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  rating: number;

  @ApiProperty()
  price: string;

  @ApiProperty()
  profileUrl: string;
}
