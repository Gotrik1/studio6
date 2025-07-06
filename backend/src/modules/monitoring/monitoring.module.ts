import { Module, Global } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
import { JsonLogger } from "./json-logger.service";

@Global()
@Module({
  controllers: [MetricsController],
  providers: [MetricsService, JsonLogger],
  exports: [MetricsService, JsonLogger],
})
export class MonitoringModule {}
