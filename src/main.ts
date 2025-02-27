import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(helmet())
  // cree le préfixe global
  app.setGlobalPrefix('api/v1')
  app.use(cookieParser(process.env.COOKIE_SECRET))
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))

  // necessaire pour le versionning
  app.enableVersioning({
    type: VersioningType.URI,
  })

  // config swagger
  const config = new DocumentBuilder()
    .setTitle('NestJs Full Api')
    .setDescription('A full NestJs Authentication')
    .setVersion('1.0')
    .addTag('Routes')
    .build()
  
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/v1', app, document)



  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL
  })
  
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
