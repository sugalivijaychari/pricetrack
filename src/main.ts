import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker API')
    .setDescription('API documentation for the Blockchain Price Tracker')
    .setVersion('1.0')
    .addTag('Price Trackers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
