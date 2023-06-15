import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AWMSModule } from './awms.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from './shared/filters/database-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  fastifyAdapter.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AWMSModule,
    fastifyAdapter,
  );

  const config = new DocumentBuilder()
    .setTitle('AWMS: API')
    .setDescription('AWMS: API specification')
    .setVersion('0.1-Alpha')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-spec', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new DatabaseExceptionFilter());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
