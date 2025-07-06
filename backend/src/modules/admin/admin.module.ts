import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UsersModule } from "../users/users.module";
import { TournamentsModule } from "../tournaments/tournaments.module";
import { MatchesModule } from "../matches/matches.module";

@Module({
  imports: [UsersModule, TournamentsModule, MatchesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
