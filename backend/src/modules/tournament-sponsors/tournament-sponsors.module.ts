import { Module } from '@nestjs/common';
import { TournamentSponsorsService } from './tournament-sponsors.service';
import { TournamentSponsorsController } from './tournament-sponsors.controller';

@Module({
  controllers: [TournamentSponsorsController],
  providers: [TournamentSponsorsService],
})
export class TournamentSponsorsModule {}
