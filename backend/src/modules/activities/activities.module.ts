import { Module } from "@nestjs/common";
import { ActivitiesService } from "./activities.service";
import { ActivitiesController } from "./activities.controller";

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
