import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

const port = process.env.PORT ?? 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
  });
  app.use(helmet());
  app.enableCors();
  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('Users example')
    .setDescription('This is a demo of NestJS with Swagger and ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(port);
}

bootstrap()
  .then(() => Logger.log(`Server is started on port ${port}`))
  .catch((err) => Logger.error(err));
