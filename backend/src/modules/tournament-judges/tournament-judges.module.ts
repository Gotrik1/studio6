import { Module } from "@nestjs/common";
import { TournamentJudgesService } from "./tournament-judges.service";
import { TournamentJudgesController } from "./tournament-judges.controller";

@Module({
  controllers: [TournamentJudgesController],
  providers: [TournamentJudgesService],
})
export class TournamentJudgesModule {}
