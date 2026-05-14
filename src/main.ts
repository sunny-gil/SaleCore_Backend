import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // 1. Global Prefix
  app.setGlobalPrefix('api');

  // 2. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Global Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Security Basics
  app.use(helmet());
  app.enableCors();

  // 4. Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('SaleCore Backend API')
    .setDescription('Professional API documentation for SaleCore application. Includes authentication, user management, and more.')
    .setVersion('1.0.0')
    .addTag('Authentication', 'Endpoints for user registration, login, and password recovery')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for @ApiBearerAuth()
    )
    .setContact('SaleCore Support', 'https://salecore.com', 'support@salecore.com')
    .setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`📁 Connected to Database: ${configService.get('MONGO_URI')}`);
}
bootstrap();
