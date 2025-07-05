import { Module } from '@nestjs/common';
import { TournamentMedicalService } from './tournament-medical.service';
import { TournamentMedicalController } from './tournament-medical.controller';

@Module({
  controllers: [TournamentMedicalController],
  providers: [TournamentMedicalService],
})
export class TournamentMedicalModule {}
