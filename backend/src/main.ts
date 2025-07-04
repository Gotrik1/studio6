import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as path from 'path';
import { JsonLogger } from './common/services/json-logger.service';
import type { LogLevel } from '@nestjs/common';

// Load environment variables from the root .env file
config({ path: path.resolve(__dirname, '../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLogger(process.env.LOG_LEVEL as LogLevel),
  });

  await app.listen(3001);

  const logger = app.get(JsonLogger);
  logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
  

