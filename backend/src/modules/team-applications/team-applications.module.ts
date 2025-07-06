import { Module } from "@nestjs/common";
import { TeamApplicationsService } from "./team-applications.service";
import { TeamApplicationsController } from "./team-applications.controller";
import { TeamsModule } from "../teams/teams.module";

@Module({
  imports: [TeamsModule],
  controllers: [TeamApplicationsController],
  providers: [TeamApplicationsService],
})
export class TeamApplicationsModule {}
