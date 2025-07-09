import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import * as path from "path";
import {
  JsonLogger,
  HttpLoggingInterceptor,
  HttpExceptionFilter,
} from "./modules/monitoring";
import type { LogLevel } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { IoAdapter } from "@nestjs/platform-socket.io";

// Load environment variables from the root .env file
config({ path: path.resolve(__dirname, "../../.env") });

async function bootstrap() {
  const logger = new JsonLogger(process.env.LOG_LEVEL as LogLevel);
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new IoAdapter(app));

  // Global interceptors and filters for observability
  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(HttpAdapterHost), logger),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("ProDvor API")
    .setDescription("API documentation for the ProDvor platform")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(3001);

  logger.log(`Application is running on: ${await app.getUrl()}`, "Bootstrap");
  logger.log(
    `Swagger docs available at: ${await app.getUrl()}/api-docs`,
    "Bootstrap",
  );
}
bootstrap();
