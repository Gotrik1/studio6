import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    this.logger.log('AppService initialized');
  }

  getHealthCheck(): string {
    this.logger.log('Health check requested');
    return 'ProDvor Backend is running!';
  }
}
