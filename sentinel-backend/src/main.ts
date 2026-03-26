import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config service
  const configService = app.get(ConfigService);

  // CORS yoqish
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger konfiguratsiyasi
  const config = new DocumentBuilder()
    .setTitle('Sentinel API')
    .setDescription('Sentinel ilovasi uchun REST API dokumentatsiyasi')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:5001', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Port
  const port = configService.get<number>('PORT') || 5001;

  await app.listen(port);

  console.log(`\n🚀 Server ishlamoqda: http://localhost:${port}`);
  console.log(`📚 API Dokumentatsiyasi: http://localhost:${port}/api-docs`);
  console.log(`📝 API Prefix: http://localhost:${port}/api\n`);
}
bootstrap();
