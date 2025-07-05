import { ApiProperty } from '@nestjs/swagger';

export class TournamentCrmDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sport: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  participants: number;

  @ApiProperty()
  maxParticipants: number;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  organizer: string;

  @ApiProperty()
  rules: string;
}
