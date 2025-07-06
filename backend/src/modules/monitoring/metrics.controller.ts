import { Controller, Get, Res } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { Public } from "../auth/decorators/public.decorator";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("Monitoring")
@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get application metrics for Prometheus" })
  @ApiResponse({
    status: 200,
    description: "Prometheus metrics.",
    headers: {
      "Content-Type": {
        schema: { type: "string" },
        description: "text/plain; version=0.0.4; charset=utf-8",
      },
    },
  })
  async getMetrics(@Res() res: Response) {
    res.set("Content-Type", this.metricsService.getContentType());
    res.end(await this.metricsService.getMetrics());
  }
}
