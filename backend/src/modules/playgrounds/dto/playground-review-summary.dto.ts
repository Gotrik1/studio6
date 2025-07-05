import { ApiProperty } from '@nestjs/swagger';

export class PlaygroundReviewSummaryDto {
  @ApiProperty({ type: [String] })
  pros: string[];

  @ApiProperty({ type: [String] })
  cons: string[];

  @ApiProperty()
  averageRating: number;
}
