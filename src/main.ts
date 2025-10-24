import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Dominio base permitido (por ejemplo .midominio.com)
const allowedDomains = (process.env.CORS_ALLOWED_DOMAINS || '')
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean);

app.enableCors({
  origin: (origin, callback) => {
    // Permitir herramientas sin origin (Postman, etc.)
    if (!origin) return callback(null, true);

    const isAllowed = allowedDomains.some((domain) => origin === domain);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isAllowed || isLocalhost) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqueado para: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});


    // ---- Swagger / OpenAPI ----
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema de gestión de ventas')             // Título visible en Swagger UI
    .setDescription('API para el sistema de gestión de ventas') // Descripción
    .setVersion('1.0')                           // Versión
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {});

  // Monta Swagger UI en /docs 
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // conserva el token al refrescar la página
    },
  });

  // Habilitar cookies
  app.use(cookieParser());

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
