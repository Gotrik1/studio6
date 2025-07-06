import { Module } from "@nestjs/common";
import { PlaygroundReportsService } from "./playground-reports.service";
import { PlaygroundReportsController } from "./playground-reports.controller";

@Module({
  providers: [PlaygroundReportsService],
  controllers: [PlaygroundReportsController],
})
export class PlaygroundReportsModule {}
