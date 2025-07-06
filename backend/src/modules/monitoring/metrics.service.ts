import { Injectable, OnModuleInit } from "@nestjs/common";
import { register, Counter } from "prom-client";

@Injectable()
export class MetricsService implements OnModuleInit {
  private requestsCounter: Counter;

  onModuleInit() {
    this.requestsCounter = new Counter({
      name: "prodvor_http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "route", "status_code"],
    });

    // We can register more metrics here as needed
  }

  incrementRequests() {
    // This is a simplified example. A real implementation would use interceptors
    // to dynamically get method, route and status code.
    this.requestsCounter.inc({ method: 'GET', route: '/', status_code: '200' });
  }

  getContentType(): string {
    return register.contentType;
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
