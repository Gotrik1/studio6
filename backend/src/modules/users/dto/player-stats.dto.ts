import { ApiProperty } from "@nestjs/swagger";

class WinLossDataDto {
  @ApiProperty()
  wins: number;
  @ApiProperty()
  losses: number;
}

class KdaDataDto {
  @ApiProperty()
  month: string;
  @ApiProperty()
  kda: number;
}

class WinrateByMapDataDto {
  @ApiProperty()
  map: string;
  @ApiProperty()
  winrate: number;
}

class PlayerStatsSummaryDto {
  @ApiProperty()
  matches: number;
  @ApiProperty()
  winrate: number;
  @ApiProperty()
  winStreak: number;
  @ApiProperty()
  kda: number;
}

export class PlayerStatsDto {
  @ApiProperty({ type: WinLossDataDto })
  winLossData: WinLossDataDto;

  @ApiProperty({ type: [KdaDataDto] })
  kdaByMonthData: KdaDataDto[];

  @ApiProperty({ type: [WinrateByMapDataDto] })
  winrateByMapData: WinrateByMapDataDto[];

  @ApiProperty({ type: PlayerStatsSummaryDto })
  summary: PlayerStatsSummaryDto;
}
