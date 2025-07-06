import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./modules/auth/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";
import { MetricsService } from "./modules/monitoring/metrics.service";

@ApiTags("Health")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly metricsService: MetricsService,
    ) {}

  @Public()
  @Get()
  getHealthCheck(): string {
    this.metricsService.incrementRequests();
    return this.appService.getHealthCheck();
  }
}
