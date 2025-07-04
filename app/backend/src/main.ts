import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from the root .env file
config({ path: path.resolve(__dirname, '../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Since we are using Next.js rewrites as a proxy, CORS is not needed
  // If you were to access the backend directly from a different domain, you would enable this.
  // app.enableCors({
  //   origin: 'http://localhost:9002', // Frontend URL
  //   credentials: true,
  // });

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
