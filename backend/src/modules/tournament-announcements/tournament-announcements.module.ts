import { Module } from "@nestjs/common";
import { TournamentAnnouncementsService } from "./tournament-announcements.service";
import { TournamentAnnouncementsController } from "./tournament-announcements.controller";

@Module({
  controllers: [TournamentAnnouncementsController],
  providers: [TournamentAnnouncementsService],
})
export class TournamentAnnouncementsModule {}
