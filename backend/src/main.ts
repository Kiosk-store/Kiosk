import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Parse cookies for HTTP-Only Refresh Tokens
  app.use(cookieParser());

  // Global Prefix for API endpoints
  app.setGlobalPrefix('v1');

  // Strict CORS Whitelist for kiosk.online and Local Development
  const allowedOrigins = [
    'https://kiosk.online',
    'https://www.kiosk.online',
    'https://admin.kiosk.online',
    'http://localhost:3000',
    'http://localhost:4000',
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.kiosk.online')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Workspace-ID'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kiosk API')
    .setDescription('Production-ready backend API service for Kiosk productized store builder')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .addServer('https://api.kiosk.online/v1', 'Production Server')
    .addServer('http://localhost:4000/v1', 'Local Development')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Kiosk Backend service successfully running on port ${port}`);
  logger.log(`Swagger documentation available at http://localhost:${port}/docs and https://api.kiosk.online/docs`);
}

bootstrap();
