
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Включить CORS для взаимодействия с фронтендом
  app.enableCors({
    origin: 'http://localhost:9002', // Указываем конкретный источник
    credentials: true,
  });
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
