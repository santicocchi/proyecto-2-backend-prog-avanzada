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
  const allowedDomain = process.env.CORS_ALLOWED_DOMAIN || '.localhost';

  // Configurar CORS para permitir todos los subdominios del dominio principal
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir herramientas sin "origin" (Postman, backend interno, etc.)
      if (!origin) return callback(null, true);

      try {
        // Permitir cualquier subdominio del dominio principal
        const regex = new RegExp(
          `^https?:\\/\\/([a-z0-9-]+\\.)*${allowedDomain.replace('.', '\\.')}$`,
          'i',
        );

        // También permitir localhost en desarrollo
        const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

        if (regex.test(origin) || isLocalhost) {
          callback(null, true);
        } else {
          console.warn(`❌ CORS bloqueado para: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      } catch (err) {
        callback(new Error('Invalid CORS configuration'));
      }
    },
    credentials: true,
  });

    // ---- Swagger / OpenAPI ----
  const swaggerConfig = new DocumentBuilder()
    .setTitle('IMC Calculator API')             // Título visible en Swagger UI
    .setDescription('API para calcular y guardar IMC') // Descripción
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
